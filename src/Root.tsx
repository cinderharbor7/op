import { Composition, Folder, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Opening } from "./film/Opening";
import { FingerprintFlow } from "./film/FingerprintFlow";
import { RiskTour } from "./film/RiskTour";
import { AttestationsLanding } from "./film/AttestationsLanding";
import { Investigation } from "./film/Investigation";
import { Research } from "./film/Research";
import { Guardian } from "./film/Guardian";
import { Wallet } from "./film/Wallet";
import { Preserve } from "./film/Preserve";
import "./style.css";
export const Film = () => (
  <>
    <Audio src={staticFile("audio/verdant-120.wav")} volume={0.7} />
    <Sequence name="00 / 数字指纹与项目名" durationInFrames={480}>
      <Opening />
    </Sequence>
    <Sequence
      name="01 / 资产图鉴与 ETH 数据"
      from={480}
      durationInFrames={630}
      premountFor={45}
    >
      <FingerprintFlow />
    </Sequence>
    <Sequence
      name="02–03 / 风险研究页面巡视"
      from={1110}
      durationInFrames={615}
      premountFor={45}
    >
      <RiskTour />
    </Sequence>
    <Sequence
      name="04 / 报告存证"
      from={1725}
      durationInFrames={180}
      premountFor={45}
    >
      <AttestationsLanding />
    </Sequence>
    <Sequence
      name="05 / 钱包授权"
      from={1905}
      durationInFrames={300}
      premountFor={45}
    >
      <Wallet />
    </Sequence>
    <Sequence
      name="06 / 收藏与存证"
      from={2205}
      durationInFrames={300}
      premountFor={45}
    >
      <Preserve />
    </Sequence>
  </>
);
const OpeningWithAudio = () => (
  <>
    <Opening />
    <Audio src={staticFile("audio/verdant-120.wav")} volume={0.7} />
  </>
);
export const RemotionRoot = () => (
  <>
    <Composition
      id="VERDANT-Film"
      component={Film}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={2505}
    />
    <Composition
      id="00-Opening"
      component={OpeningWithAudio}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={480}
    />
    <Composition
      id="01-Fingerprint"
      component={FingerprintFlow}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={630}
    />
    <Composition
      id="02-03-RiskResearch"
      component={RiskTour}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={615}
    />
    <Composition
      id="04-Attestations"
      component={AttestationsLanding}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={180}
    />
    <Composition
      id="05-Wallet"
      component={Wallet}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
    <Composition
      id="06-Preserve"
      component={Preserve}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
    />
    <Folder name="Previous-Templates">
      <Composition
        id="Previous-Investigation"
        component={Investigation}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={360}
      />
      <Composition
        id="Previous-Research"
        component={Research}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={360}
      />
      <Composition
        id="Previous-Guardian"
        component={Guardian}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={360}
      />
    </Folder>
  </>
);
