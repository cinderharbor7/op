import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { FramedStage } from "./Frame";
import { Caption, FilmLabel, BeatWipe } from "../Motion";
import { move } from "../design";
export const Preserve = () => {
  const f = useCurrentFrame(),
    report = f >= 150;
  return (
    <AbsoluteFill>
      <FramedStage timeOffset={73.5}>
        <NativePage
          state={{
            page: report ? "attestations" : "detail",
            dialog: !report && f >= 42 ? "mint" : undefined,
            progress: report && f >= 205 ? 1 : 0,
            scrollTarget: report ? ".workspace-grid" : undefined,
            scrollProgress: report ? move(f, 150, 180) : 0,
            scrollPad: 80,
          }}
          camera={
            !report
              ? {
                  from: f < 42 ? ".detail-overview" : "#modal",
                  zoom: f < 42 ? 1.4 : 1.08,
                  unbounded: f >= 42,
                }
              : {
                  from: ".workspace-grid .workspace-panel:first-child",
                  to: ".workspace-grid .dark-panel",
                  mix: move(f, 210, 255),
                  zoom: 1.45,
                }
          }
          cursor={
            f < 42
              ? {
                  target: '.detail-overview [data-action="mint"]',
                  start: 3,
                  arrive: 36,
                  click: 42,
                }
              : report && f < 208
                ? {
                    target: '[data-report="prepare"]',
                    start: 170,
                    arrive: 200,
                    click: 205,
                  }
                : undefined
          }
        />
      </FramedStage>
      <Caption
        number="06"
        zh="把这一刻，留成固定的数据切片。"
        en="Collect the original contour edition."
        from={2}
        to={132}
      />
      <Caption
        number="06"
        zh="报告与指纹，各自独立存证。"
        en="Separate contracts. Explicit wallet confirmation."
        from={160}
        to={297}
      />
      <FilmLabel>原站 HTML / BOT Chain Testnet 968</FilmLabel>
      <BeatWipe at={140} />
    </AbsoluteFill>
  );
};
