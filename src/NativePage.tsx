import React, { useLayoutEffect, useRef, useState } from "react";
import {
  delayRender,
  continueRender,
  cancelRender,
  staticFile,
  useCurrentFrame,
  IFrame,
} from "remotion";
import { move, lerp } from "./design";
export type NativeState = {
  page:
    | "home"
    | "detail"
    | "investigate"
    | "risk-lab"
    | "guardian"
    | "attestations";
  view?: "contour" | "fluid";
  dialog?: "guide" | "mint";
  progress?: number;
  connected?: boolean;
  scrollTarget?: string;
  scrollFrom?: string;
  scrollProgress?: number;
  scrollPad?: number;
  scrollOffset?: number;
  scrollFromOffset?: number;
  scrollNudge?: number;
  reveal?: number;
  hideArt?: boolean;
  heroCoin?: string;
  artOpacity?: number;
  fingerprintScale?: number;
  heroSpin?: number;
  smoothReveal?: boolean;
  stageTint?: string;
  isolate?: string;
};
type Box = { x: number; y: number; width: number; height: number };
type Bridge = {
  seek: (s: NativeState & { time: number }) => unknown;
  box: (s: string) => Box | null;
  fontsReady: Promise<unknown>;
};
type Camera = {
  from?: string;
  to?: string;
  mix?: number;
  zoom?: number;
  biasY?: number;
  focusHeight?: number;
  unbounded?: boolean;
};
export type NativeCursor = {
  target: string;
  from?: string;
  start: number;
  arrive: number;
  click?: number;
  exit?: number;
  pressDepth?: number;
  size?: number;
  screenOrigin?: boolean;
};
export const NativePage: React.FC<{
  state: NativeState;
  camera?: Camera;
  cursor?: NativeCursor;
  opacity?: number;
  time?: number;
}> = ({ state, camera = {}, cursor, opacity = 1, time }) => {
  const f = useCurrentFrame(),
    iframe = useRef<HTMLIFrameElement>(null),
    layer = useRef<HTMLDivElement>(null),
    pointer = useRef<HTMLDivElement>(null),
    ring = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false),
    [initial] = useState(() => delayRender("Load original HTML/CSS"));
  useLayoutEffect(() => {
    if (!loaded) return;
    const wait = delayRender(`Native frame ${f}`);
    let active = true;
    const bridge = (
      iframe.current?.contentWindow as unknown as { film: Bridge }
    )?.film;
    if (!bridge) {
      cancelRender(new Error("Native webpage bridge missing"));
      return;
    }
    bridge.fontsReady
      .then(() => {
        if (!active) {
          continueRender(wait);
          return;
        }
        bridge.seek({ ...state, time: time ?? f / 30 });
        const center = (selector?: string) => {
          const r =
            selector && selector !== "$viewport" ? bridge.box(selector) : null;
          return r
            ? {
                x: r.x + r.width / 2,
                y: r.y + Math.min(r.height, camera.focusHeight ?? 660) / 2,
              }
            : { x: 720, y: 405 };
        };
        const a = center(camera.from),
          b = center(camera.to ?? camera.from),
          mix = camera.mix ?? 1;
        const x = lerp(a.x, b.x, mix),
          y = lerp(a.y, b.y, mix) + (camera.biasY ?? 0),
          scale = ((camera.zoom ?? 1) * 4) / 3;
        const tx = camera.unbounded
            ? 960 - x * scale
            : scale < 4 / 3
              ? (1920 - 1440 * scale) / 2
              : Math.max(1920 - 1440 * scale, Math.min(0, 960 - x * scale)),
          ty = camera.unbounded
            ? 540 - y * scale
            : scale < 4 / 3
              ? (1080 - 810 * scale) / 2
              : Math.max(1080 - 810 * scale, Math.min(0, 540 - y * scale));
        layer.current!.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
        if (cursor && pointer.current) {
          const r = bridge.box(cursor.target),
            start = cursor.from ? bridge.box(cursor.from) : null;
          if (r) {
            const p = move(f, cursor.start, cursor.arrive),
              x0 = start
                ? start.x + start.width / 2
                : cursor.screenOrigin
                  ? (1810 - tx) / scale
                  : 1320,
              y0 = start
                ? start.y + start.height / 2
                : cursor.screenOrigin
                  ? (1000 - ty) / scale
                  : 760;
            const px =
                lerp(x0, r.x + r.width / 2, p) + Math.sin(p * Math.PI) * 70,
              py = lerp(y0, r.y + r.height / 2, p) - Math.sin(p * Math.PI) * 90;
            pointer.current.style.left = `${tx + px * scale}px`;
            pointer.current.style.top = `${ty + py * scale}px`;
            pointer.current.style.opacity = String(
              move(f, cursor.start, cursor.start + 6) *
                (1 - move(f, cursor.exit ?? 9999, (cursor.exit ?? 9999) + 10)),
            );
            const age = f - (cursor.click ?? 9999),
              hit = age >= 0 && age < 20;
            pointer.current.style.scale = String(
              hit
                ? 1 -
                    (cursor.pressDepth ?? 0.18) *
                      Math.sin(Math.min(1, age / 9) * Math.PI)
                : 1,
            );
            if (ring.current) {
              ring.current.style.opacity = String(hit ? 1 - age / 20 : 0);
              ring.current.style.scale = String(hit ? 1 + age / 5 : 1);
            }
          } else pointer.current.style.opacity = "0";
        }
        continueRender(wait);
        continueRender(initial);
      })
      .catch(cancelRender);
    return () => {
      active = false;
      continueRender(wait);
    };
  }, [f, loaded, state, camera, cursor, time, initial]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: state.isolate
          ? "transparent"
          : state.dialog
            ? "#878d85"
            : "#f7f1e7",
        overflow: "hidden",
        opacity,
      }}
    >
      <div
        ref={layer}
        style={{
          position: "absolute",
          width: 1440,
          height: 810,
          transformOrigin: "0 0",
        }}
      >
        <IFrame
          ref={iframe}
          title="VERDANT original HTML film surface"
          src={staticFile("site/index.html")}
          onLoad={() => setLoaded(true)}
          style={{
            width: 1440,
            height: 810,
            border: 0,
            display: "block",
            pointerEvents: "none",
          }}
        />
      </div>
      {cursor && (
        <div
          ref={pointer}
          style={{
            position: "absolute",
            zIndex: 20,
            opacity: 0,
            transformOrigin: "0 0",
            pointerEvents: "none",
          }}
        >
          <div
            ref={ring}
            style={{
              position: "absolute",
              width: 22,
              height: 22,
              left: -11,
              top: -11,
              border: "2px solid #c66b3d",
              borderRadius: "50%",
              opacity: 0,
            }}
          />
          <svg
            width={cursor.size ?? 38}
            height={((cursor.size ?? 38) * 47) / 38}
            viewBox="0 0 42 52"
            style={{ filter: "drop-shadow(0 3px 4px #0005)" }}
          >
            <path
              d="M2 2L3 39L13 29L22 48L29 45L21 26L36 26Z"
              fill="#fffaf0"
              stroke="#26352f"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
