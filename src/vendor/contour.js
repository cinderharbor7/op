export function contourPoints(
  p,
  latitude,
  time = 0,
  count = 100,
  mouse = { x: 0, y: 0 },
) {
  const points = [],
    phi = latitude * Math.PI;
  const tilt = -0.35 + mouse.y * 0.14,
    turn = 0.35 + mouse.x * 0.22 + time * 0.045;
  for (let j = 0; j <= count; j++) {
    const a = (j / count) * Math.PI * 2;
    const wave =
      Math.sin(a * 3 + phi * 4 + p.seed + time * 0.22) * p.roughness * 0.21 +
      Math.cos(a * 5 - phi * 3 + time * 0.14) * p.roughness * 0.07;
    const radius = Math.sin(phi) * (1 + wave);
    let x = radius * Math.cos(a),
      y = Math.cos(phi) * 1.12,
      z = radius * Math.sin(a);
    y +=
      Math.sin(a * 2 + phi * 2 + time * 0.16) *
      Math.sin(phi) *
      p.roughness *
      0.24;
    const xx = x * Math.cos(turn) + z * Math.sin(turn),
      zz = -x * Math.sin(turn) + z * Math.cos(turn);
    const yy = y * Math.cos(0.4) - zz * Math.sin(0.4),
      depth = y * Math.sin(0.4) + zz * Math.cos(0.4);
    x = xx * Math.cos(tilt) - yy * Math.sin(tilt);
    y = xx * Math.sin(tilt) + yy * Math.cos(tilt);
    const perspective = 3.8 / (3.8 - depth * 0.22);
    points.push([x * perspective, y * perspective, depth]);
  }
  return points;
}