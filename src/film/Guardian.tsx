import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { Caption, FilmLabel } from "../Motion";
import { move } from "../design";
export const Guardian = () => {
  const f = useCurrentFrame(),
    target =
      f < 154
        ? "#guardian-controls"
        : f < 257
          ? "#guardian-results"
          : "#guardian-results .workspace-panel:nth-last-child(2)";
  return (
    <AbsoluteFill>
      <NativePage
        state={{
          page: "guardian",
          progress: f < 105 ? 0 : f < 154 ? 1 : 2,
          scrollTarget: target,
          scrollFrom:
            f < 154
              ? undefined
              : f < 257
                ? "#guardian-controls"
                : "#guardian-results",
          scrollProgress:
            f < 154
              ? move(f, 0, 40)
              : f < 257
                ? move(f, 154, 197)
                : move(f, 257, 309),
          scrollPad: 90,
        }}
        camera={{
          from: f < 154 ? "#policy-form" : target,
          to:
            f < 154
              ? "#guardian-controls .workspace-panel:first-child"
              : target,
          mix: f < 154 ? move(f, 64, 105) : 1,
          zoom: f < 154 ? 1.5 : 1.5 - move(f, 154, 204) * 0.52,
          focusHeight: f < 257 ? 570 : 620,
        }}
        cursor={
          f < 154
            ? {
                target: '[data-guardian="run"]',
                start: 70,
                arrive: 100,
                click: 105,
                exit: 128,
              }
            : undefined
        }
      />
      <Caption
        number="04"
        zh="权限先设定，动作才有边界。"
        en="Set the policy before execution."
        from={2}
        to={150}
      />
      <Caption
        number="04"
        zh="单次运行，保留完整执行记录。"
        en="One approved action. An inspectable record."
        from={165}
        to={250}
      />
      <Caption
        number="04"
        zh="执行之后，再次读取并核验。"
        en="Independently read back the result."
        from={275}
        to={357}
      />
      <FilmLabel>原站 HTML / 内存 MOCK 演示</FilmLabel>
    </AbsoluteFill>
  );
};
