// Adapted from radiumcoders/23rd.dev ASCII Fluid. See third-party/23rd/README.md.
const DEFAULT_CHARSET =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
const FRAG_DISPLAY = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_dye;
uniform sampler2D u_atlas;
uniform vec2 u_resolution;
uniform vec2 u_cell;
uniform float u_charCount;
uniform vec3 u_ink;
uniform vec3 u_paper;
uniform float u_time;
uniform float u_animate;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 pixel = v_uv * u_resolution;
  vec2 cell = floor(pixel / u_cell);
  vec2 cellUv = (cell + 0.5) * u_cell / u_resolution;

  float dens = clamp(texture2D(u_dye, cellUv).x, 0.0, 1.0);

  // Soft neighborhood sample for a low-res glow halo under the glyphs
  vec2 texel = u_cell / u_resolution;
  float glow =
    dens * 0.40 +
    texture2D(u_dye, cellUv + vec2( texel.x, 0.0)).x * 0.15 +
    texture2D(u_dye, cellUv - vec2( texel.x, 0.0)).x * 0.15 +
    texture2D(u_dye, cellUv + vec2(0.0,  texel.y)).x * 0.15 +
    texture2D(u_dye, cellUv - vec2(0.0,  texel.y)).x * 0.15;
  glow = clamp(glow, 0.0, 1.0);
  glow = pow(glow, 1.35);

  float lit = dens;
  if (u_animate > 0.5) {
    float flicker = hash21(cell + floor(u_time * 10.0)) - 0.5;
    lit = clamp(lit + flicker * 0.05, 0.0, 1.0);
  }

  float idx = min(floor(lit * (u_charCount - 0.001)), u_charCount - 1.0);
  vec2 local = fract(pixel / u_cell);
  float u0 = (idx + local.x) / u_charCount;
  float glyph = texture2D(u_atlas, vec2(u0, local.y)).r;

  float alpha = glyph * smoothstep(0.02, 0.12, dens);

  // Paper → soft ink wash → sharp ASCII on top
  float wash = glow * 0.22;
  vec3 col = mix(u_paper, u_ink, wash);
  col = mix(col, u_ink, clamp(alpha, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;
function buildAtlas(
  gl: WebGLRenderingContext,
  charset: string,
): { tex: WebGLTexture; count: number } | null {
  const count = Math.max(charset.length, 1);
  const size = 64;
  const atlasCanvas = document.createElement("canvas");
  atlasCanvas.width = size * count;
  atlasCanvas.height = size;
  const ctx = atlasCanvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, atlasCanvas.width, atlasCanvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `400 ${Math.floor(size * 0.72)}px "SF Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < count; i++) {
    const ch = charset[i] ?? " ";
    if (ch === " ") continue;
    ctx.fillText(ch, size * (i + 0.5), size * 0.55);
  }

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    atlasCanvas,
  );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  return { tex, count };
}
export { DEFAULT_CHARSET, VERT, FRAG_DISPLAY, buildAtlas };
