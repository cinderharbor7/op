import { useCurrentFrame } from "remotion";
import { C, mono, move } from "../design";
export const ProjectName = ({ start = 390 }: { start?: number }) => {
  const frame = useCurrentFrame(),
    f = frame - start,
    name = "VERDANT";
  const word = f < 5 ? "V3RDA#T" : f < 9 ? "VERD@NT" : name;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.paper,
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const p = move(f, 3 + i, 30 + i),
          side = i % 2 ? -1 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + side * (560 + p * 550),
              top: 540 + Math.sin(i * 2) * p * 520,
              width: 160 - i * 12,
              height: 160 - i * 12,
              borderRadius: "50%",
              background: i % 2 ? C.sage : C.clay,
              opacity: 1 - p,
              translate: "-50% -50%",
              scale: 1 - p * 0.6,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          scale: move(f, 0, 15, 0.84, 1),
          fontFamily: mono,
          fontSize: 154,
          fontWeight: 500,
          letterSpacing: -8,
          color: C.ink,
        }}
      >
        <span
          style={{ color: C.clay, translate: `${move(f, 0, 16, -150, 0)}px 0` }}
        >
          [
        </span>
        {Array.from(word).map((ch, i) => {
          const age = f - i * 0.8,
            pulse =
              age > 0 && age < 13 ? Math.sin(Math.PI * move(age, 0, 13)) : 0;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 100,
                textAlign: "center",
                translate: `0 ${-pulse * 48}px`,
                opacity: move(f, i * 0.8, i * 0.8 + 4),
                color: pulse > 0.7 ? C.moss : C.ink,
              }}
            >
              {ch}
            </span>
          );
        })}
        <span
          style={{ color: C.moss, translate: `${move(f, 0, 16, 150, 0)}px 0` }}
        >
          ]
        </span>
      </div>
    </div>
  );
};
