import { Easing, interpolate } from "remotion";
export const C = {
  bg: "#0b1210",
  paper: "#f7f1e7",
  sand: "#e8dcc7",
  ink: "#26352f",
  muted: "#5b6a60",
  moss: "#606c38",
  sage: "#8b9d83",
  acid: "#d5f98b",
  clay: "#c66b3d",
  line: "#c9c6b5",
};
export const mono = '"SF Mono", monospace';
export const sans = '"PingFang SC", sans-serif';
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const move = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const beat = 15; // 120 BPM at 30 fps
