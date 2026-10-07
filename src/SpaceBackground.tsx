import { useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  cancelRender,
  useCurrentFrame,
} from "remotion";
import {
  DEFAULT_CHARSET,
  VERT,
  FRAG_DISPLAY,
  buildAtlas,
} from "./vendor/ascii-fluid-display";
import { fontsReady } from "./fonts";

export const AsciiFluidBackground = ({
  timeOffset = 0,
}: {
  timeOffset?: number;
}) => {
  const f = useCurrentFrame(),
    ref = useRef<HTMLCanvasElement>(null),
    engine = useRef<{
      gl: WebGLRenderingContext;
      program: WebGLProgram;
      dye: WebGLTexture;
      atlas: WebGLTexture;
      count: number;
      buffer: WebGLBuffer;
    } | null>(null);
  const [ready] = useState(() => delayRender("23rd ASCII atlas"));
  useLayoutEffect(() => {
    let active = true;
    const handle = delayRender("23rd ASCII frame");
    fontsReady
      .then(() => {
        if (!active) {
          continueRender(handle);
          return;
        }
        if (!engine.current) {
          const gl = ref.current!.getContext("webgl", {
            preserveDrawingBuffer: true,
            alpha: false,
          })!;
          if (!gl) throw Error("ASCII WebGL unavailable");
          const compile = (type: number, source: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
              throw Error(gl.getShaderInfoLog(s) ?? "Shader error");
            return s;
          };
          const vs = compile(gl.VERTEX_SHADER, VERT),
            fs = compile(gl.FRAGMENT_SHADER, FRAG_DISPLAY),
            program = gl.createProgram()!;
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw Error("ASCII shader link failed");
          const buffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
          );
          gl.useProgram(program);
          const pos = gl.getAttribLocation(program, "a_position");
          gl.enableVertexAttribArray(pos);
          gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
          const atlas = buildAtlas(gl, DEFAULT_CHARSET)!;
          const dye = gl.createTexture()!;
          gl.bindTexture(gl.TEXTURE_2D, dye);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          engine.current = {
            gl,
            program,
            dye,
            atlas: atlas.tex,
            count: atlas.count,
            buffer,
          };
        }
        const { gl, program, dye, atlas, count } = engine.current,
          t = (f / 30 + timeOffset) * 0.23,
          w = 128,
          h = 72,
          data = new Uint8Array(w * h * 4);
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++) {
            const u = (x / w) * 6.28,
              v = (y / h) * 6.28;
            const wave =
              Math.sin(u * 1.7 + Math.sin(v * 0.8 + t) * 1.7 + t) +
              Math.cos(v * 2.3 - u * 0.5 - t * 0.7);
            const density = Math.max(0, Math.min(0.86, (wave + 0.65) * 0.27));
            const i = (y * w + x) * 4;
            data[i] = Math.round(density * 255);
            data[i + 3] = 255;
          }
        gl.viewport(0, 0, 1920, 1080);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, dye);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          w,
          h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          data,
        );
        gl.uniform1i(gl.getUniformLocation(program, "u_dye"), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, atlas);
        gl.uniform1i(gl.getUniformLocation(program, "u_atlas"), 1);
        gl.uniform2f(
          gl.getUniformLocation(program, "u_resolution"),
          1920,
          1080,
        );
        gl.uniform2f(gl.getUniformLocation(program, "u_cell"), 16, 16);
        gl.uniform1f(gl.getUniformLocation(program, "u_charCount"), count);
        gl.uniform3f(gl.getUniformLocation(program, "u_ink"), 0.32, 0.43, 0.37);
        gl.uniform3f(gl.getUniformLocation(program, "u_paper"), 0.9, 0.93, 0.9);
        gl.uniform1f(gl.getUniformLocation(program, "u_time"), t);
        gl.uniform1f(gl.getUniformLocation(program, "u_animate"), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        continueRender(ready);
        continueRender(handle);
      })
      .catch(cancelRender);
    return () => {
      active = false;
      continueRender(handle);
    };
  }, [f, ready, timeOffset]);
  useLayoutEffect(
    () => () => {
      const e = engine.current;
      if (e) {
        e.gl.deleteTexture(e.dye);
        e.gl.deleteTexture(e.atlas);
        e.gl.deleteProgram(e.program);
        e.gl.deleteBuffer(e.buffer);
        engine.current = null;
      }
    },
    [],
  );
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
    />
  );
};

const random = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const PixelStarfield = ({ timeOffset = 0 }: { timeOffset?: number }) => {
  const frame = useCurrentFrame(),
    ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#1f302b";
    ctx.fillRect(0, 0, 1920, 1080);
    const t = frame / 30 + timeOffset;
    for (let i = 0; i < 650; i++) {
      const z = 50 + ((random(i) * 950 - t * 12 + 9500) % 950),
        x = 960 + ((random(i + 2000) - 0.5) * 1200 * 960) / z,
        y = 540 + ((random(i + 4000) - 0.5) * 900 * 960) / z;
      if (x < 0 || x > 1920 || y < 0 || y > 1080) continue;
      const near = 1 - z / 1000,
        s = 1 + near * 3;
      ctx.globalAlpha = 0.14 + near * 0.5;
      ctx.fillStyle = ["#a3b2a0", "#d7dfc9", "#72999a"][i % 3];
      ctx.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, s, s);
    }
    ctx.globalAlpha = 1;
  }, [frame, timeOffset]);
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
