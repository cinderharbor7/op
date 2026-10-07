import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { Caption, FilmLabel } from "../Motion";
import { move } from "../design";
export const Research = () => {
  const f = useCurrentFrame();
  const target =
    f < 115
      ? "#research-result .workspace-grid"
      : f < 221
        ? ".research-metrics"
        : ".model-grid";
  return (
    <AbsoluteFill>
      <NativePage
        state={{
          page: "risk-lab",
          scrollTarget: target,
          scrollFrom:
            f < 115
              ? undefined
              : f < 221
                ? "#research-result .workspace-grid"
                : ".research-metrics",
          scrollProgress:
            f < 115
              ? move(f, 0, 37)
              : f < 221
                ? move(f, 115, 160)
                : move(f, 221, 274),
          scrollPad: 80,
        }}
        camera={{
          from:
            f < 115
              ? target
              : f < 160
                ? "#research-result .workspace-grid"
                : f < 221
                  ? target
                  : f < 274
                    ? ".research-metrics"
                    : target,
          to: f < 276 ? target : ".model-grid article:nth-child(2)",
          mix:
            f < 115
              ? 1
              : f < 221
                ? move(f, 115, 160)
                : f < 276
                  ? move(f, 221, 274)
                  : move(f, 276, 340),
          zoom:
            f < 115
              ? 1.05
              : f < 221
                ? 1.05 + move(f, 115, 160) * 0.15
                : 1.2 + move(f, 276, 340) * 0.28,
        }}
      />
      <Caption
        number="03"
        zh="从风险轮廓，深入模型依据。"
        en="Move from the signal to the evidence."
        from={5}
        to={110}
      />
      <Caption
        number="03"
        zh="卖压、波动、杠杆：一起观察。"
        en="Inspect the inputs in context."
        from={125}
        to={220}
      />
      <Caption
        number="03"
        zh="公式、引用与局限，都在页面中。"
        en="Methods, citations, and limits stay visible."
        from={236}
        to={357}
      />
      <FilmLabel>原站 HTML / MOCK_CHAIN_FIXTURE</FilmLabel>
    </AbsoluteFill>
  );
};
