import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { NativePage } from "../NativePage";
import { ParticleFingerprint, Texture } from "../NativeArt";
import { ProjectName } from "./ProjectName";
import { move, mono, sans, lerp } from "../design";
const COINS = ["BTC", "SOL", "BNB", "LINK", "UNI", "AVAX", "DOGE", "ETH"];
const names: Record<string, string> = {
  BOT: "BOT Chain",
  BTC: "Bitcoin",
  SOL: "Solana",
  BNB: "BNB",
  LINK: "Chainlink",
  UNI: "Uniswap",
  AVAX: "Avalanche",
  DOGE: "Dogecoin",
  ETH: "Ethereum",
};
const themes: Record<string, string> = {
  BOT: "#e4ebe1",
  BTC: "#eadbc3",
  SOL: "#d6e7df",
  BNB: "#eee3bb",
  LINK: "#dce1ef",
  UNI: "#f0dce6",
  AVAX: "#eedbd6",
  DOGE: "#ece3c9",
  ETH: "#e1e3ef",
};
const heartbeat = (f: number, start: number) =>
  interpolate(
    f,
    [
      start,
      start + 7,
      start + 12,
      start + 16,
      start + 21,
      start + 26,
      start + 34,
    ],
    [1, 0.9, 1.1, 0.88, 1.065, 0.975, 1],
    {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
const spin = (f: number, start: number) =>
  f < start || f >= start + 34
    ? 0
    : interpolate(f, [start, start + 34], [0, Math.PI * 2], {
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      });
export const Opening = () => {
  const frame = useCurrentFrame(),
    f = Math.min(frame, 361),
    flash = f >= 198 && f < 270;
  const index = Math.max(0, Math.min(7, Math.floor((f - 198) / 9))),
    local = f - 198 - index * 9;
  const coin = flash ? COINS[index] : f < 270 ? "BOT" : "ETH",
    previous = index === 0 ? "BOT" : COINS[index - 1];
  const tint = flash
    ? interpolateColors(
        move(local, 0, 3),
        [0, 1],
        [themes[previous], themes[coin]],
      )
    : themes[coin];
  const pull = move(f, 280, 361),
    reveal = move(f, 292, 361),
    fluid = f >= 132 && f < 172;
  const closeZoom = f < 198 ? 2 : (2 * 1180) / 1360;
  const scale = 0.5 * heartbeat(f, 116) * heartbeat(f, 156),
    rotation = spin(f, 116) + spin(f, 156);
  return (
    <AbsoluteFill style={{ background: tint, overflow: "hidden" }}>
      <NativePage
        state={{
          page: "home",
          heroCoin: f < 270 ? "BOT" : "ETH",
          view: fluid ? "fluid" : "contour",
          reveal,
          smoothReveal: true,
          stageTint: tint,
          artOpacity: move(f, 82, 104),
          fingerprintScale: scale,
          heroSpin: rotation,
        }}
        camera={{
          from: ".hero-art",
          to: "$viewport",
          mix: pull,
          zoom: closeZoom + (1 - closeZoom) * pull,
        }}
        time={f / 30}
      />
      {f < 106 && <ParticleFingerprint sizeScale={0.5} />}
      {flash && (
        <AbsoluteFill style={{ background: tint }}>
          <div
            style={{
              position: "absolute",
              left: 665,
              top: 245,
              width: 590,
              height: 590,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 1 - move(local, 0, 3),
              }}
            >
              <Texture
                coin={index === 0 ? "BTC" : previous}
                size={590}
                time={f / 30}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: move(local, 0, 3),
              }}
            >
              <Texture coin={coin} size={590} time={f / 30} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {frame < 390 && (
        <>
          <div
            style={{
              position: "absolute",
              left: lerp(960, 1324, pull),
              top: lerp(178, 361, pull),
              translate: "-50% 0",
              fontFamily: mono,
              fontWeight: 500,
              fontSize: lerp(50, 26, pull),
              letterSpacing: "-.04em",
              whiteSpace: "nowrap",
              color: "#26352f",
              opacity: move(f, 28, 52),
            }}
          >
            {names[coin]}
          </div>
          <div
            style={{
              position: "absolute",
              left: lerp(960, 1324, pull),
              top: lerp(832, 728, pull),
              translate: "-50% 0",
              fontFamily: sans,
              fontWeight: 400,
              fontSize: lerp(24, 18, pull),
              letterSpacing: ".13em",
              whiteSpace: "nowrap",
              color: "#5b6a60",
              opacity: move(f, 28, 52),
            }}
          >
            {fluid ? "流体指纹" : "纹理指纹"}
          </div>
        </>
      )}
      {frame >= 390 && <ProjectName start={390} />}
    </AbsoluteFill>
  );
};
