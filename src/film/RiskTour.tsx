import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { NativePage, NativeState } from "../NativePage";
import { FramedStage } from "./Frame";
import { move } from "../design";
const overview = "#research-result .workspace-grid",
  inputs = "#film-risk-inputs",
  models = "#film-risk-models",
  sources = "#film-risk-sources",
  publish = 'a[href="/attestations?source=research"]';
export const RiskTour = () => {
  const f = useCurrentFrame(),
    arrived = f >= 600;
  let state: NativeState = { page: "risk-lab" };
  if (f >= 60 && f < 165)
    state = {
      ...state,
      scrollTarget: overview,
      scrollProgress: move(f, 60, 150),
      scrollPad: 95,
    };
  else if (f >= 165 && f < 270)
    state = {
      ...state,
      scrollFrom: overview,
      scrollTarget: inputs,
      scrollProgress: move(f, 165, 255),
      scrollPad: 95,
      scrollNudge: f < 270 ? -12 * Math.sin(Math.PI * move(f, 255, 270)) : 0,
    };
  else if (f >= 270 && f < 390)
    state = {
      ...state,
      scrollFrom: inputs,
      scrollTarget: models,
      scrollProgress: move(f, 270, 375),
      scrollPad: 95,
      scrollNudge: f < 390 ? -10 * Math.sin(Math.PI * move(f, 375, 390)) : 0,
    };
  else if (f >= 390 && f < 480)
    state = {
      ...state,
      scrollFrom: models,
      scrollTarget: sources,
      scrollOffset: -710,
      scrollProgress: move(f, 390, 468),
      scrollPad: 95,
    };
  else if (f >= 480)
    state = {
      ...state,
      scrollFrom: sources,
      scrollFromOffset: -710,
      scrollTarget: publish,
      scrollProgress: move(f, 480, 510),
      scrollPad: 95,
    };
  if (arrived) state = { page: "attestations" };
  const zoom =
    f < 510
      ? 1
      : f < 555
        ? 1 + move(f, 510, 540) * 1.1
        : 2.1 - move(f, 555, 600) * 1.38;
  return (
    <AbsoluteFill>
      <FramedStage timeOffset={37}>
        <NativePage
          state={state}
          time={arrived ? 0 : f / 30}
          camera={{
            from: f < 510 || arrived ? "$viewport" : publish,
            to: f < 555 ? publish : "$viewport",
            mix: f < 510 ? 0 : f < 555 ? move(f, 510, 540) : move(f, 555, 600),
            zoom,
          }}
          cursor={
            !arrived && f >= 518
              ? {
                  target: publish,
                  start: 518,
                  arrive: 545,
                  click: 552,
                  exit: 575,
                  size: 52,
                  pressDepth: 0.28,
                  screenOrigin: true,
                }
              : undefined
          }
        />
      </FramedStage>
      <Sequence from={552} durationInFrames={8} layout="none">
        <Audio src={staticFile("audio/ui-click.wav")} volume={0.65} />
      </Sequence>
    </AbsoluteFill>
  );
};
