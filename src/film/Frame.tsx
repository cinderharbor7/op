import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AsciiFluidBackground, PixelStarfield } from "../SpaceBackground";
import { C, move } from "../design";
export const FramedStage = ({
  timeOffset = 0,
  enter = true,
  children,
}: {
  timeOffset?: number;
  enter?: boolean;
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PixelStarfield timeOffset={timeOffset} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: enter ? move(f, 0, 30) : 1,
        }}
      >
        <AsciiFluidBackground timeOffset={timeOffset} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 192,
          top: 108,
          width: 1536,
          height: 864,
          overflow: "hidden",
          border: `2px solid ${C.ink}`,
          boxShadow: "0 30px 90px #00000045",
          opacity: enter ? move(f, 0, 18) : 1,
          translate: enter ? `0 ${move(f, 0, 24, 46, 0)}px` : "0 0",
        }}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            scale: 0.8,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
