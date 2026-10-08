import { useCurrentFrame } from "remotion";
import { Texture } from "../NativeArt";
import { PANEL } from "./DataPanels";
import { C, mono, sans, move } from "../design";

// 文案逐字取自 xjy/web/app.js 的 mintDialog()，不改一个字。
const ROWS = [
  ["网络", "BOT Chain Testnet"],
  ["数据", "演示数据"],
  ["版本", "纹理版 v1 / SVG"],
  ["存储", "图像与快照完整上链"],
] as const;
const NOTICES = [
  "我知道这是演示数据 NFT，不是真实市场快照。",
  "尚未配置 NFT 合约。可先下载快照，或打开测试网设置部署合约。",
] as const;

/**
 * 06 的收藏窗口：用 remotion 重绘，占满 01 同款的面板幅面，
 * 背景由 Preserve 提供（PixelStarfield + AsciiFluidBackground）。
 * 指纹用 sourcePaint 固定快照绘制 —— 收藏的本义就是"这一刻不再变化"。
 */
export const MintPanel = () => {
  const f = useCurrentFrame(),
    start = 44,
    end = 140;
  return (
    <div
      style={{
        position: "absolute",
        ...PANEL,
        background: C.paper,
        borderTop: `2px solid ${C.ink}`,
        boxShadow: "0 25px 75px #26352f16",
        fontFamily: sans,
        color: C.ink,
        opacity: move(f, start, start + 18) * (1 - move(f, end - 12, end)),
        translate: `${
          move(f, start, start + 24, -165, 0) + move(f, end - 12, end) * 100
        }px ${move(f, start, start + 24, 28, 0)}px`,
        padding: "42px 62px 38px",
      }}
    >
      <span
        style={{
          position: "absolute",
          right: 26,
          top: 20,
          fontFamily: mono,
          fontSize: 34,
          lineHeight: 1,
          color: "#9aa596",
        }}
      >
        ×
      </span>
      <h2
        style={{
          fontSize: 44,
          fontWeight: 500,
          letterSpacing: "-.035em",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        收藏此刻的指纹
      </h2>
      <div
        style={{
          fontFamily: mono,
          fontSize: 15,
          color: "#778175",
          letterSpacing: ".08em",
          marginTop: 11,
        }}
      >
        CONTOUR EDITION / 纹理版 v1 · SVG
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "296px 1fr",
          gap: 44,
          alignItems: "center",
          marginTop: 26,
        }}
      >
        <div style={{ border: `1px solid ${C.line}`, background: "#f1f4f8", padding: 12 }}>
          <Texture coin="ETH" size={230} time={1.4} />
          <div
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "#526177",
              marginTop: 9,
              letterSpacing: ".05em",
            }}
          >
            ETH / CURRENCY FINGERPRINT
          </div>
        </div>
        <div>
          <h3
            style={{
              fontSize: 36,
              fontWeight: 600,
              margin: 0,
              letterSpacing: "-.02em",
              lineHeight: 1.15,
            }}
          >
            Ethereum
          </h3>
          <dl
            style={{
              margin: "20px 0 0",
              display: "grid",
              gridTemplateColumns: "104px 1fr",
              rowGap: 16,
              columnGap: 32,
            }}
          >
            {ROWS.map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt style={{ fontSize: 20, color: "#69766a" }}>{k}</dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: mono,
                    fontSize: 21,
                    letterSpacing: "-.01em",
                  }}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p
        style={{
          fontSize: 21,
          lineHeight: 1.7,
          color: "#4d5c50",
          margin: "24px 0 0",
        }}
      >
        收藏的是这一刻的固定纹理，不随后续行情改变。铸造费用为钱包显示的测试
        BOT Gas，合约不收取额外铸造费。
      </p>
      <div style={{ marginTop: 18, display: "grid", rowGap: 11 }}>
        {NOTICES.map((text, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 19,
              lineHeight: 1.5,
              color: "#785133",
              borderLeft: `3px solid ${C.clay}`,
              background: "#ede2cf",
              padding: "11px 18px",
            }}
          >
            {i === 0 && (
              <span
                style={{
                  width: 15,
                  height: 15,
                  border: `1.5px solid #a08564`,
                  background: C.paper,
                  flexShrink: 0,
                }}
              />
            )}
            {text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 24, alignItems: "center" }}>
        <span
          style={{
            background: C.ink,
            color: C.paper,
            padding: "13px 28px",
            fontSize: 20,
            opacity: 0.42,
          }}
        >
          确认并在钱包铸造
        </span>
        <span
          style={{
            border: "1px solid #aaa995",
            color: C.ink,
            background: "transparent",
            padding: "13px 28px",
            fontSize: 20,
          }}
        >
          下载快照
        </span>
        <span style={{ fontSize: 19, color: "#69766a", textDecoration: "underline" }}>
          测试网设置
        </span>
      </div>
    </div>
  );
};
