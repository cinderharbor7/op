import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { Caption, FilmLabel } from "../Motion";
import { move } from "../design";
export const Investigation = () => {
  const f = useCurrentFrame(),
    progress = f < 55 ? 0 : f < 108 ? 1 : f < 143 ? 2 : 3;
  return (
    <AbsoluteFill>
      <NativePage
        state={{
          page: "investigate",
          progress,
          scrollTarget: f >= 152 ? "#research-result" : undefined,
          scrollProgress: move(f, 152, 217),
          scrollPad: 80,
        }}
        camera={
          f < 152
            ? {
                from: "$viewport",
                to: ".query-form",
                mix: move(f, 10, 60),
                zoom: 1 + move(f, 10, 60) * 0.65,
              }
            : {
                from: ".query-form",
                to: "#research-result .workspace-grid",
                mix: move(f, 152, 217),
                zoom: 1.65 - move(f, 152, 217) * 0.63,
                focusHeight: 330,
              }
        }
        cursor={
          f < 80
            ? {
                target: '[data-research="example"]',
                start: 6,
                arrive: 50,
                click: 55,
              }
            : f < 143
              ? {
                  from: '[data-research="example"]',
                  target: '.query-form button[type="submit"]',
                  start: 80,
                  arrive: 104,
                  click: 108,
                }
              : undefined
        }
      />
      <Caption
        number="02"
        zh="大额转账，不能直接等同于卖出。"
        en="A transfer is a lead. Verify what it proves."
        from={2}
        to={139}
      />
      <Caption
        number="02"
        zh="事实与未知，分开呈现。"
        en="Confirmed facts. Explicit uncertainties."
        from={158}
        to={357}
      />
      <FilmLabel>原站 HTML / 核验结果为动画样本</FilmLabel>
    </AbsoluteFill>
  );
};
