// Generated from xjy/web/fingerprint/render.js by build-native.mjs. Do not simplify.
import {visualParameters} from './data.js';
import {contourPoints} from './contour.js';
export function sourcePaint(ctx,coin,sentiment,width,height,time,small=false,mouse={x:0,y:0}){const p=visualParameters(coin,coin.visualIdentity?{value:null}:sentiment),r={width,height};const size = Math.min(r.width, r.height) * (small ? 0.37 : 0.345),
        cx = r.width / 2,
        cy = r.height / 2;
const bands = small ? 30 : 83,
        steps = small ? 54 : 112;
ctx.lineWidth = small ? 1.05 : 1.4;
for (let i = 1; i < bands; i++) {
        const latitude = i / bands,
          points = contourPoints(
            p,
            latitude,
            time * (0.3 + p.activity * 0.5),
            steps,
            mouse,
          );
        const hue = p.hue + Math.sin(latitude * Math.PI * 2 + p.mood * 2) * 66;
        const gradient = ctx.createLinearGradient(
          cx - size,
          cy - size,
          cx + size,
          cy + size,
        );
        gradient.addColorStop(0, `hsla(${hue - 38},65%,48%,.82)`);
        gradient.addColorStop(
          0.46,
          `hsla(${hue + 55},60%,${48 + p.mood * 8}%,.92)`,
        );
        gradient.addColorStop(1, `hsla(${hue + 130},65%,44%,.78)`);
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        points.forEach(([x, y], j) =>
          j
            ? ctx.lineTo(cx + x * size, cy + y * size)
            : ctx.moveTo(cx + x * size, cy + y * size),
        );
        ctx.stroke();
      }}
