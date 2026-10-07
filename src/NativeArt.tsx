import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { contourPoints } from "./vendor/contour";
import { sampleMarket, visualParameters } from "./vendor/data";
import { sourcePaint } from "./vendor/source-paint";
import { move, lerp, mono, C } from "./design";
const noise = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const ParticleFingerprint = ({
  sizeScale = 1,
}: {
  sizeScale?: number;
}) => {
  const f = useCurrentFrame(),
    ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.clearRect(0, 0, 1920, 1080);
    const p = visualParameters(
      { id: "BOT", color: 155, amplitude: null, volume: null },
      { value: null },
    );
    const scale = 1360 * 0.345 * sizeScale;
    for (let b = 1; b < 83; b++) {
      const points = contourPoints(
        p,
        b / 83,
        (f / 30) * (0.3 + p.activity * 0.5),
        112,
      );
      const hue = p.hue + Math.sin((b / 83) * Math.PI * 2 + p.mood * 2) * 66;
      const grad = ctx.createLinearGradient(
        960 - scale,
        540 - scale,
        960 + scale,
        540 + scale,
      );
      grad.addColorStop(0, `hsla(${hue - 38},65%,48%,.82)`);
      grad.addColorStop(0.46, `hsla(${hue + 55},60%,${48 + p.mood * 8}%,.92)`);
      grad.addColorStop(1, `hsla(${hue + 130},65%,44%,.78)`);
      ctx.fillStyle = grad;
      points.forEach(([x, y]: number[], j: number) => {
        if (j % 2) return;
        const id = b * 113 + j,
          delay = noise(id) * 22,
          pull = move(f, 12 + delay, 75 + delay),
          spin = (1 - pull) * (3.3 + noise(id + 1));
        const tx = 960 + x * scale,
          ty = 540 + y * scale,
          radius = 1250 + noise(id + 2) * 1350,
          angle = noise(id + 3) * Math.PI * 2;
        const sx = 960 + Math.cos(angle + spin) * radius,
          sy = 540 + Math.sin(angle + spin) * radius * 0.66;
        const px = lerp(sx, tx, pull),
          py = lerp(sy, ty, pull),
          a = move(f, 0, 12) * (1 - move(f, 86, 105));
        ctx.globalAlpha = a * (0.8 + 0.2 * pull);
        ctx.fillStyle =
          pull < 0.68
            ? ["#26352f", "#606c38", "#9d4d29", "#2a8a7a"][id % 4]
            : grad;
        const size = lerp(12 + noise(id) * 12, 2.1, pull);
        if (pull < 0.55 && j % 4 === 0) {
          ctx.font = `400 ${size}px ${mono}`;
          ctx.fillText("01:+*#"[id % 6], px, py);
        } else
          ctx.fillRect(
            px,
            py,
            Math.max(2.2, size * (0.7 - 0.35 * pull)),
            Math.max(2.2, size * (0.7 - 0.35 * pull)),
          );
        if (pull > 0.35 && pull < 0.85) {
          ctx.globalAlpha = a * 0.18;
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + (tx - px) * 0.06, py + (ty - py) * 0.06);
          ctx.stroke();
        }
      });
    }
    ctx.globalAlpha = 1;
  }, [f, sizeScale]);
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
};
export const Texture = ({
  coin = "ETH",
  size = 1100,
  time = 0,
}: {
  coin?: string;
  size?: number;
  time?: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current!,
      ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    const market = sampleMarket(),
      c = market.coins.find((c) => c.id === coin) ?? market.coins[0];
    sourcePaint(ctx, c, market.sentiment, size, size, time);
  }, [coin, size, time]);
  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ width: size, height: size, display: "block" }}
    />
  );
};
export const LetterBurst = ({
  text,
  start = 0,
}: {
  text: string;
  start?: number;
}) => {
  const f = useCurrentFrame() - start;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from(text).map((ch, i) => {
        const t = move(f, 0, 14 + i * 0.7),
          out = move(f, 22 + i * 0.4, 35);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 960 + (i - text.length / 2) * 110,
              top: 390,
              fontFamily: mono,
              fontSize: 190,
              fontWeight: 500,
              letterSpacing: -12,
              color: i % 3 === 0 ? C.clay : C.ink,
              opacity: t * (1 - out),
              translate: `${(1 - t) * (i % 2 ? 900 : -900) + out * (i - text.length / 2) * 170}px ${(1 - t) * Math.sin(i) * 600 - out * 800}px`,
              rotate: `${(1 - t) * (i % 2 ? 70 : -70) + out * 40}deg`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
