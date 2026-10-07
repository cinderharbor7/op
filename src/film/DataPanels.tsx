import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { sampleMarket, sampleHistory, visualParameters } from "../vendor/data";
import { C, mono, sans, move, lerp } from "../design";
const market = sampleMarket(),
  eth = market.coins[0],
  history = sampleHistory(eth, 1),
  params = visualParameters(eth, market.sentiment);
export const PANEL = { left: 240, top: 170, width: 1440, height: 730 };

export const DataPanel = ({
  title,
  en,
  start,
  end,
  children,
}: {
  title: string;
  en: string;
  start: number;
  end: number;
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame(),
    a = move(f, start, start + 18) * (1 - move(f, end - 12, end));
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
        opacity: a,
        translate: `${move(f, start, start + 24, -165, 0) + move(f, end - 12, end) * 100}px ${move(f, start, start + 24, 28, 0)}px`,
        padding: "52px 72px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: 47,
            fontWeight: 500,
            letterSpacing: "-.035em",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <span
          style={{
            fontFamily: mono,
            fontSize: 15,
            color: "#778175",
            letterSpacing: ".08em",
          }}
        >
          ETH / DEMO
        </span>
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          color: "#69766a",
          marginTop: 13,
          letterSpacing: ".015em",
        }}
      >
        {en}
      </div>
      {children}
    </div>
  );
};
export const MarketTrajectory = () => {
  const f = useCurrentFrame(),
    start = 165,
    p = move(f, start + 18, start + 80);
  const min = Math.min(...history.map((d) => d.close)),
    max = Math.max(...history.map((d) => d.close));
  const points = history.map((d, i) => ({
    x: 85 + (i / 24) * 1140,
    y: 335 - ((d.close - min) / (max - min)) * 260,
    value: d.close,
  }));
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1],
      next = points[i],
      a = points[Math.max(0, i - 2)],
      b = points[Math.min(24, i + 1)];
    d += ` C${prev.x + (next.x - a.x) / 6},${prev.y + (next.y - a.y) / 6} ${next.x - (b.x - prev.x) / 6},${next.y - (b.y - prev.y) / 6} ${next.x},${next.y}`;
  }
  const idx = p * 24,
    k = Math.min(23, Math.floor(idx)),
    v = lerp(points[k].value, points[k + 1].value, idx - k);
  return (
    <DataPanel
      title="市场轨迹"
      en="PRICE THROUGH TIME / 演示曲线 · 非历史行情"
      start={165}
      end={300}
    >
      <div
        style={{
          position: "absolute",
          right: 74,
          top: 134,
          fontFamily: mono,
          fontSize: 27,
          color: C.clay,
        }}
      >
        {v.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        <small style={{ fontSize: 15, marginLeft: 10 }}>USDT</small>
      </div>
      <svg
        width="1296"
        height="455"
        viewBox="0 0 1296 455"
        style={{ marginTop: 51, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="trajectory-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.clay} stopOpacity=".24" />
            <stop offset="100%" stopColor={C.clay} stopOpacity="0" />
          </linearGradient>
          <clipPath id="trajectory-reveal">
            <rect x="80" y="0" width={1148 * p} height="380" />
          </clipPath>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={move(f, start + 12 + i * 4, start + 32 + i * 4)}>
            <path
              d={`M85 ${75 + i * 87}H1225`}
              stroke={C.line}
              strokeDasharray="3 7"
            />
            <text
              x="66"
              y={82 + i * 87}
              textAnchor="end"
              fill="#7d877b"
              fontFamily={mono}
              fontSize="17"
            >
              {Math.round(max - ((max - min) * i) / 3)}
            </text>
          </g>
        ))}
        <g clipPath="url(#trajectory-reveal)">
          <path d={`${d}L1225 370H85Z`} fill="url(#trajectory-fill)" />
          <path
            d={d}
            fill="none"
            stroke={C.clay}
            strokeWidth="3.7"
            strokeLinecap="round"
          />
        </g>
        {[0, 6, 12, 18, 24].map((i) => (
          <text
            key={i}
            x={85 + (i / 24) * 1140}
            y="410"
            textAnchor="middle"
            fill="#6d7a6c"
            fontFamily={mono}
            fontSize="20"
          >
            {String(i).padStart(2, "0")}h
          </text>
        ))}
      </svg>
    </DataPanel>
  );
};
export const MarketSentiment = () => {
  const f = useCurrentFrame(),
    p = move(f, 302, 340),
    value = Math.round(68 * p);
  return (
    <DataPanel
      title="市场情绪温度"
      en="MARKET SENTIMENT / 全市场背景指标"
      start={285}
      end={405}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          marginTop: 36,
          opacity: move(f, 294, 312),
          translate: `${move(f, 294, 318, -65, 0)}px 0`,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 133,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: 33, color: C.moss, opacity: p }}>贪婪</span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 16,
            color: "#879180",
            marginLeft: "auto",
          }}
        >
          DEMO INDEX / 100
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 35,
          marginTop: 62,
          background: C.sand,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${move(f, 304, 342) * 100}%`,
            background:
              "linear-gradient(90deg,#a65643,#c89152,#d2c579,#9aac70,#61835d)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${68 * p}%`,
            top: -15,
            width: 3,
            height: 67,
            background: C.ink,
            opacity: move(f, 306, 320),
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              background: C.ink,
              rotate: "45deg",
              left: -4.5,
              top: -5,
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 26,
          fontSize: 21,
          color: "#63725f",
          opacity: move(f, 312, 332),
        }}
      >
        <span>极度恐惧</span>
        <span>恐惧</span>
        <span>中性</span>
        <span>贪婪</span>
        <span>极度贪婪</span>
      </div>
      <p
        style={{
          fontSize: 21,
          lineHeight: 1.8,
          color: "#72806c",
          marginTop: 51,
          opacity: move(f, 332, 352),
        }}
      >
        演示情绪指数，源页面映射为全市场背景。
        <br />
        它不是 ETH 的独立情绪评分。
      </p>
    </DataPanel>
  );
};
export const FingerprintDimensions = () => {
  const f = useCurrentFrame();
  const rows = [
    ["市场情绪", params.mood, "68", C.clay],
    ["日内振幅", params.roughness, "6.40%", C.sage],
    ["交易活跃", params.activity, "187.20 亿", C.moss],
  ] as const;
  return (
    <DataPanel
      title="指纹的构成"
      en="READ THE FINGERPRINT / 三个可解释的视觉维度"
      start={390}
      end={510}
    >
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 121,
          fontSize: 21,
          color: C.ink,
          borderBottom: `1px solid ${C.ink}`,
          paddingBottom: 6,
          opacity: move(f, 412, 432),
        }}
      >
        查看映射 ↗
      </div>
      <div style={{ marginTop: 76 }}>
        {rows.map(([name, ratio, value, color], i) => (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "190px 1fr 175px",
              gap: 34,
              alignItems: "center",
              margin: "0 0 52px",
              opacity: move(f, 406 + i * 10, 422 + i * 10),
              translate: `${move(f, 406 + i * 10, 434 + i * 10, -95, 0)}px 0`,
            }}
          >
            <span style={{ fontSize: 27 }}>{name}</span>
            <div style={{ height: 9, background: C.sand }}>
              <div
                style={{
                  height: "100%",
                  width: `${ratio * 100 * move(f, 418 + i * 10, 450 + i * 10)}%`,
                  background: color,
                }}
              />
            </div>
            <span
              style={{ fontFamily: mono, fontSize: 27, textAlign: "right" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontSize: 21,
          color: "#72806c",
          marginTop: 32,
          opacity: move(f, 458, 476),
        }}
      >
        缺失维度使用中性形态；数值仍显示为 —。图形不是信用评分。
      </p>
    </DataPanel>
  );
};

export const GuidePanel = () => {
  const f = useCurrentFrame(),
    start = 495,
    a = move(f, start, start + 14);
  const rows = [
    [
      "色彩",
      "币种拥有固定基础色相；全市场恐惧贪婪指数影响色彩分布，不代表某个币的独立新闻情绪。",
      C.clay,
    ],
    [
      "形态",
      "日内振幅 =（24h 最高价 − 最低价）÷ 开盘价。振幅越大纹理起伏越明显，15% 为视觉映射上限。",
      C.sage,
    ],
    [
      "节奏",
      "24h USDT 成交额经 log10 归一化，影响动态速度。不同币种可在同一尺度下观察。",
      C.moss,
    ],
    [
      "收藏",
      "将此刻参数生成固定的矢量纹理版 NFT：SVG、数值、来源状态与时间一并写入链上。",
      C.ink,
    ],
  ] as const;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: "#0b1210b8", opacity: a }} />
      <div
        style={{
          position: "relative",
          width: 1240,
          background: C.paper,
          borderTop: `2px solid ${C.ink}`,
          boxShadow: "0 30px 90px #00000038",
          padding: "52px 76px 48px",
          fontFamily: sans,
          color: C.ink,
          opacity: a,
          translate: `0 ${move(f, start, start + 20, 54, 0)}px`,
          scale: move(f, start, start + 20, 0.965, 1),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            opacity: move(f, start + 4, start + 18),
          }}
        >
          <h2
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-.03em",
              margin: 0,
            }}
          >
            读懂一枚货币指纹
          </h2>
          <span
            style={{
              fontFamily: mono,
              fontSize: 15,
              color: "#778175",
              letterSpacing: ".08em",
            }}
          >
            GUIDE / ETH
          </span>
        </div>
        <p
          style={{
            fontSize: 21,
            lineHeight: 1.75,
            color: "#63725f",
            margin: "18px 0 0",
            opacity: move(f, start + 8, start + 22),
          }}
        >
          它是一份市场数据的视觉切片。同样的数据与参数会生成相同的静态收藏版本，动态视图则让结构更容易被观察。
        </p>
        <div style={{ marginTop: 34 }}>
          {rows.map(([name, text, color], i) => {
            const r0 = start + 12 + i * 8;
            return (
              <div
                key={name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "108px 1fr",
                  gap: 30,
                  alignItems: "start",
                  padding: "17px 0",
                  borderTop: `1px solid ${C.line}`,
                  opacity: move(f, r0, r0 + 12),
                  translate: `${move(f, r0, r0 + 16, -60, 0)}px 0`,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  {name}
                </span>
                <span
                  style={{ fontSize: 20, lineHeight: 1.7, color: "#4d5c50" }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
            opacity: move(f, start + 46, start + 60),
          }}
        >
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "#72806c",
              margin: 0,
            }}
          >
            首页焦点是编辑精选，不是收益排行；缺失数据使用中性形态并显示
            —。漂亮的指纹不等于安全的资产。
          </p>
          <span
            style={{
              fontSize: 19,
              padding: "10px 26px",
              background: C.ink,
              color: C.paper,
              flexShrink: 0,
              marginLeft: 40,
            }}
          >
            明白了
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MappingCursor = () => {
  const f = useCurrentFrame(),
    p = move(f, 440, 475),
    age = f - 480,
    press = age >= 0 && age < 14 ? Math.sin(Math.PI * move(age, 0, 14)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(1820, 1531, p) + Math.sin(p * Math.PI) * 36,
        top: lerp(1000, 313, p) - Math.sin(p * Math.PI) * 70,
        opacity: move(f, 440, 450) * (1 - move(f, 492, 502)),
        scale: 1 - press * 0.24,
        transformOrigin: "0 0",
      }}
    >
      {age >= 0 && age < 22 && (
        <div
          style={{
            position: "absolute",
            width: 26,
            height: 26,
            left: -13,
            top: -13,
            border: `2px solid ${C.clay}`,
            borderRadius: "50%",
            scale: 1 + move(age, 0, 22) * 3,
            opacity: 1 - move(age, 0, 22),
          }}
        />
      )}
      <svg width="48" height="59" viewBox="0 0 42 52">
        <path
          d="M2 2L3 39L13 29L22 48L29 45L21 26L36 26Z"
          fill={C.paper}
          stroke={C.ink}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
