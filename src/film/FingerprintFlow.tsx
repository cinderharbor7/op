import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { NativePage } from "../NativePage";
import { AsciiFluidBackground, PixelStarfield } from "../SpaceBackground";
import {
  MarketTrajectory,
  MarketSentiment,
  FingerprintDimensions,
  MappingCursor,
  GuidePanel,
} from "./DataPanels";
import { move } from "../design";
export const FingerprintFlow = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PixelStarfield timeOffset={16} />
      <div
        style={{ position: "absolute", inset: 0, opacity: move(f, 165, 200) }}
      >
        <AsciiFluidBackground timeOffset={16} />
      </div>
      {f < 120 && (
        <NativePage
          state={{
            page: "home",
            scrollTarget: ".catalogue",
            scrollProgress: 1,
            scrollPad: 24,
          }}
          cursor={{
            target: '.coin-card[href="/coins/ETH"]',
            start: 30,
            arrive: 65,
            click: 75,
            exit: 100,
            pressDepth: 0.28,
            size: 52,
            screenOrigin: true,
          }}
          opacity={1 - move(f, 105, 120)}
        />
      )}
      {f >= 90 && f < 165 && (
        <NativePage
          state={{ page: "detail" }}
          opacity={move(f, 90, 112) * (1 - move(f, 150, 165))}
        />
      )}
      {f >= 165 && f < 300 && <MarketTrajectory />}
      {f >= 285 && f < 405 && <MarketSentiment />}
      {f >= 390 && f < 510 && (
        <>
          <FingerprintDimensions />
          <MappingCursor />
        </>
      )}
      {f >= 495 && <GuidePanel />}
      <Sequence from={75} durationInFrames={8} layout="none">
        <Audio src={staticFile("audio/ui-click.wav")} volume={0.65} />
      </Sequence>
      <Sequence from={480} durationInFrames={8} layout="none">
        <Audio src={staticFile("audio/ui-click.wav")} volume={0.65} />
      </Sequence>
    </AbsoluteFill>
  );
};
