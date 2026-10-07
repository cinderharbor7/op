import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, sans, move } from "./design";
export const Caption = ({
  zh,
  en,
  from = 0,
  to = 360,
  number,
}: {
  zh: string;
  en: string;
  from?: number;
  to?: number;
  number?: string;
}) => {
  const f = useCurrentFrame(),
    opacity = move(f, from, from + 13) * (1 - move(f, to - 12, to));
  return (
    <div
      style={{
        position: "absolute",
        left: 52,
        bottom: 40,
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        color: C.paper,
        opacity,
        translate: `${move(f, from, from + 18, -70, 0)}px 0`,
        fontFamily: sans,
        pointerEvents: "none",
        textShadow: "0 2px 18px #0007",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-28px -45px",
          background: "#17251eef",
          zIndex: -1,
          clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 100%,0 100%)",
        }}
      />
      {number && (
        <span
          style={{
            fontFamily: mono,
            fontWeight: 400,
            fontSize: 15,
            color: C.sage,
            paddingTop: 9,
          }}
        >
          {number}
        </span>
      )}
      <div>
        <div
          style={{
            fontSize: 37,
            fontWeight: 500,
            lineHeight: 1.3,
            letterSpacing: ".015em",
          }}
        >
          {zh}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: ".015em",
            marginTop: 10,
            color: "#c7d2ba",
          }}
        >
          {en}
        </div>
      </div>
    </div>
  );
};
export const BeatWipe = ({
  at = 0,
  color = C.clay,
}: {
  at?: number;
  color?: string;
}) => {
  const f = useCurrentFrame() - at;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * 320,
            top: 0,
            width: 321,
            height: 1080,
            background: color,
            translate: `0 ${f < 0 ? -1200 : f < 10 ? move(f, i * 0.6, 8 + i * 0.6, -1200, 0) : move(f, 10 + i * 0.4, 20 + i * 0.4, 0, 1200)}px`,
          }}
        />
      ))}
    </div>
  );
};
export const FilmLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      right: 28,
      top: 22,
      fontFamily: mono,
      fontSize: 13,
      letterSpacing: ".045em",
      padding: "8px 12px",
      background: "#f7f1e7df",
      color: C.ink,
      pointerEvents: "none",
    }}
  >
    {children}
  </div>
);
