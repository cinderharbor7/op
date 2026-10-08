import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NativePage } from "../NativePage";
import { FramedStage } from "./Frame";
import { Caption, FilmLabel } from "../Motion";
import { C, sans, mono, move } from "../design";
export const Wallet = () => {
  const f = useCurrentFrame(),
    open = move(f, 48, 70),
    done = f >= 190;
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <FramedStage timeOffset={63.5}>
        <NativePage
          state={{ page: "attestations", connected: done }}
          camera={{
            from: "$viewport",
            to: '[data-action="wallet"]',
            mix: move(f, 0, 30) * (1 - move(f, 50, 80)),
            zoom: 1 + move(f, 0, 30) * 0.55 * (1 - move(f, 50, 80)),
          }}
          cursor={
            f < 80
              ? {
                  target: '[data-action="wallet"]',
                  start: 8,
                  arrive: 42,
                  click: 48,
                  exit: 66,
                }
              : undefined
          }
        />
      </FramedStage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.ink,
          opacity: open * 0.24,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 72,
          width: 568,
          padding: "24px 32px 32px",
          background: "#fff",
          color: "#24272a",
          boxShadow: "0 30px 150px #17251e65",
          translate: `${move(f, 48, 72, 710, 0)}px 0`,
          rotate: `${move(f, 48, 72, 8, 0)}deg`,
          transformOrigin: "right center",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 13,
            borderBottom: "1px solid #dadce0",
            paddingBottom: 17,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>MetaMask</span>
          <span>— □ ×</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 17,
            margin: "27px 0 22px",
          }}
        >
          <svg width="60" height="55" viewBox="0 0 80 70">
            <path
              d="M5 3L32 22L48 22L75 3L68 48L48 64L32 64L12 48Z"
              fill="#e78c36"
            />
            <path d="M5 3L30 36L12 48ZM75 3L50 36L68 48Z" fill="#c5612a" />
            <path d="M24 41L34 45L30 50ZM56 41L46 45L50 50Z" fill="#382c2b" />
          </svg>
          <span style={{ fontFamily: mono, fontSize: 23, fontWeight: 500 }}>
            METAMASK
          </span>
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.3,
            letterSpacing: "-.02em",
          }}
        >
          {done ? "连接已确认" : "连接此网站"}
        </div>
        <div style={{ fontSize: 17, color: "#6d7480", margin: "15px 0 26px" }}>
          VERDANT · localhost
        </div>
        <div
          style={{
            border: "1px solid #ced5df",
            padding: "22px 24px",
            borderRadius: 9,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
            }}
          >
            <span>Account 1</span>
            <span style={{ color: "#0376c9" }}>✓</span>
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 16,
              marginTop: 11,
              color: "#6d7480",
            }}
          >
            0x12…89AB
          </div>
        </div>
        <div style={{ fontSize: 19, lineHeight: 1.85, margin: "27px 0" }}>
          允许网站查看账户地址。
          <br />
          后续签名和交易仍需单独确认。
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              border: "1px solid #0376c9",
              color: "#0376c9",
              padding: 16,
              borderRadius: 30,
              fontSize: 21,
            }}
          >
            取消
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              background: "#0376c9",
              color: "white",
              padding: 16,
              borderRadius: 30,
              fontSize: 21,
            }}
          >
            {done ? "已连接" : "连接"}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#8a9098", marginTop: 18 }}>
          连接授权动画示意 · 非真实钱包窗口
        </div>
      </div>
      {f >= 90 && (
        <svg
          width="40"
          height="48"
          viewBox="0 0 42 52"
          style={{
            position: "absolute",
            left: move(f, 90, 180, 1050, 1701),
            top: move(f, 90, 180, 970, 608),
            filter: "drop-shadow(0 3px 3px #0004)",
            scale: 1 - 0.15 * Math.sin(move(f, 190, 199) * Math.PI),
          }}
        >
          <path
            d="M2 2L3 39L13 29L22 48L29 45L21 26L36 26Z"
            fill="white"
            stroke={C.ink}
            strokeWidth="2"
          />
        </svg>
      )}
      <Caption
        number="05"
        zh="拉起钱包，由你确认连接。"
        en="Connect only after reviewing the request."
        from={5}
        to={172}
      />
      <Caption
        number="05"
        zh="连接账户，不代表授权转移资产。"
        en="Connection is not transaction approval."
        from={198}
        to={297}
      />
      <FilmLabel>原站页面 + MetaMask 示意窗口</FilmLabel>
    </AbsoluteFill>
  );
};
