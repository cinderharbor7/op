import { useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { FramedStage } from "./Frame";
import { move } from "../design";
export const AttestationsLanding = () => {
  const f = Math.min(useCurrentFrame(), 45);
  return (
    <FramedStage timeOffset={57.5} enter={false}>
      <NativePage
        state={{ page: "attestations" }}
        camera={{ zoom: 0.72 + 0.28 * move(f, 0, 30) }}
        time={f / 30}
      />
    </FramedStage>
  );
};
