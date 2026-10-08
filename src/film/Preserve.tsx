import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { FramedStage } from "./Frame";
import { MintPanel } from "./MintPanel";
import { AsciiFluidBackground, PixelStarfield } from "../SpaceBackground";
import { Caption, FilmLabel, BeatWipe } from "../Motion";
import { move } from "../design";
export const Preserve = () => {
  const f = useCurrentFrame(),
    report = f >= 150;
  return (
    <AbsoluteFill>
      {/* 背景：01 同款，全程只有一份 */}
      <PixelStarfield timeOffset={73.5} />
      <div style={{ position: "absolute", inset: 0, opacity: move(f, 0, 30) }}>
        <AsciiFluidBackground timeOffset={73.5} />
      </div>
      {/* 0–53：详情页，光标去点收藏此刻；42 起淡出交给收藏窗口 */}
      {f < 54 && (
        <AbsoluteFill style={{ opacity: 1 - move(f, 42, 54) }}>
          <FramedStage timeOffset={73.5} background={false}>
            <NativePage
              state={{ page: "detail" }}
              camera={{ from: ".detail-overview", zoom: 1.4 }}
              cursor={{
                target: '.detail-overview [data-action="mint"]',
                start: 3,
                arrive: 36,
                click: 42,
              }}
            />
          </FramedStage>
        </AbsoluteFill>
      )}
      {/* 42–149：收藏窗口，remotion 重绘 */}
      {!report && f >= 42 && <MintPanel />}
      {/* 150 起：报告与指纹各自存证 */}
      {report && (
        <FramedStage timeOffset={73.5} background={false}>
          <NativePage
            state={{
              page: "attestations",
              progress: f >= 205 ? 1 : 0,
              scrollTarget: ".workspace-grid",
              scrollProgress: move(f, 150, 180),
              scrollPad: 80,
            }}
            camera={{
              from: ".workspace-grid .workspace-panel:first-child",
              to: ".workspace-grid .dark-panel",
              mix: move(f, 210, 255),
              zoom: 1.45,
            }}
            cursor={
              f < 208
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
      )}
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
