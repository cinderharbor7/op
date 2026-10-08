import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { NativePage, NativeState } from "../NativePage";
import { FramedStage } from "./Frame";
import { move } from "../design";
const overview = "#research-result .workspace-grid",
  inputs = "#film-risk-inputs",
  models = "#film-risk-models",
  sources = "#film-risk-sources",
  publish = 'a[href="/attestations?source=research"]';
// 120 BPM 节拍点：60 起手、510 抵达页底，共 30 拍。落点之间的帧全部用于滚动，不留停驻。
const beats = [60, 165, 270, 390, 480, 510];
// 与 beats 一一对应的页面落点，第 0 项为页顶（不指定 scrollFrom 即从 0 起算）。
const marks: { sel?: string; offset: number }[] = [
  { offset: 0 },
  { sel: overview, offset: 0 },
  { sel: inputs, offset: 0 },
  { sel: models, offset: 0 },
  { sel: sources, offset: -710 },
  { sel: publish, offset: 0 },
];
const SCROLL_PAD = 95;
// 整段滚动只由这一条速度曲线驱动：起手 15 帧内由静止升到匀速，收尾 20 帧内
// 由匀速降到静止，中段速度恒定。这样四个内容落点之间既不停顿也不回弹，
// 各段读速与原设计完全一致（实测均为 1.000×），只有末尾一趟会提速冲到底。
const SCROLL_SPAN = beats[beats.length - 1] - beats[0],
  RAMP_IN = 15 / SCROLL_SPAN,
  RAMP_OUT = 20 / SCROLL_SPAN,
  CRUISE = 1 / (1 - (RAMP_IN + RAMP_OUT) / 2);
const ramped = (t: number) =>
  t <= RAMP_IN
    ? (CRUISE * t * t) / (2 * RAMP_IN)
    : t >= 1 - RAMP_OUT
      ? CRUISE * (1 - RAMP_IN / 2 - RAMP_OUT) +
        (CRUISE * RAMP_OUT) / 2 -
        (CRUISE * (1 - t) * (1 - t)) / (2 * RAMP_OUT)
      : CRUISE * (RAMP_IN / 2 + t - RAMP_IN);
const glide = (f: number) =>
  interpolate(f, [beats[0], beats[beats.length - 1]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ramped,
  });
const glideMarks = beats.map(glide);
export const RiskTour = () => {
  const f = useCurrentFrame(),
    arrived = f >= 600;
  let state: NativeState = { page: "risk-lab" };
  if (f >= beats[0]) {
    let i = 0;
    while (i < beats.length - 2 && f >= beats[i + 1]) i++;
    const span = glideMarks[i + 1] - glideMarks[i];
    state = {
      ...state,
      scrollFrom: marks[i].sel,
      scrollFromOffset: marks[i].offset,
      scrollTarget: marks[i + 1].sel,
      scrollOffset: marks[i + 1].offset,
      scrollPad: SCROLL_PAD,
      scrollProgress: span > 0 ? (glide(f) - glideMarks[i]) / span : 1,
    };
  }
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
