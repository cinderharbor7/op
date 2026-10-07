import {esc,money,pct,time,pageHead,badge,panel,list,table,facts,explorer,rawDetails,assetTag} from '../../../xjy/web/ui.js';
export function transactionReportHTML(report) {
  const {
    transaction: t,
    supportedSwaps: swaps,
    evidence,
    scope,
  } = report.observation;
  return `<section class="report-conclusion">${badge(report.mode)}<h2>${esc(report.headline)}</h2><p>${esc(report.summary)}</p><small>核查时间 ${time(report.checkedAt)}</small></section><div class="workspace-grid">${panel("已确认的事实", list(report.confirmedFacts))}${panel("仍无法确认", list(report.uncertainties), "dark-panel")}${panel(
    "外层交易记录",
    `<p class="note">外层 ETH 金额不等于钱包净流出，也不等于卖出数量。</p>${facts(
      [
        ["状态", esc(t.status)],
        ["原生 ETH 金额", esc(t.nativeValueEth) + " ETH"],
        ["交易", explorer("tx", t.hash)],
        ["From", explorer("address", t.from)],
        ["To", t.to ? explorer("address", t.to) : "创建合约"],
        ["区块", explorer("block", String(t.blockNumber))],
        ["区块哈希", `<code>${esc(t.blockHash)}</code>`],
        ["区块时间", time(t.timestamp)],
        ["日志数", esc(t.logCount)],
      ],
    )}${rawDetails(t.input, "交易输入数据")}`,
    "wide",
  )}${panel(
    "指定池兑换证据",
    `<p>${esc(scope.poolLabel)}</p><p>${explorer("address", scope.poolAddress)}</p><div class="asset-pair">${assetTag("WETH")}${assetTag("USDC")}</div><p class="note">WETH 是包装 ETH；USDC 列为代币数量，不换算成美元。事件不合并为钱包净买卖方向。</p>${
      swaps.length
        ? table(
            ["日志", "方向", "WETH 数量", "USDC 数量"],
            swaps.map((s) => [
              esc(s.logIndex),
              s.direction === "SELL_ETH" ? "卖出 WETH" : "买入 WETH",
              esc(s.wethAmount),
              esc(s.usdcAmount),
            ]),
          )
        : `<p>${t.status === "REVERTED" ? "交易已回滚，无成功兑换事件。" : "未找到该池的兑换证据，不代表在其他池或场所没有卖出。"}</p>`
    }`,
    "wide",
  )}${panel("证据出处", list(evidence.map((e) => e.description)) + evidence.map((e) => `<div class="evidence-row">${e.type === "BLOCK" ? explorer("block", e.blockHash) : explorer("tx", e.txHash)}<p>${esc(e.source)}</p>${e.type === "CONTRACT_EVENT" ? explorer("address", e.contractAddress) : ""}</div>`).join(""))}${panel("下一步", list(report.nextSteps))}</div>`;
}
export function riskReportHTML(s) {
  return `<div class="status-band">${badge(s.dataMode, "warn")}<span>${esc(s.sourceNote)}</span><span>${time(s.asOf)}</span></div><div class="workspace-grid">${panel(
    "ETH 风险研究",
    facts([
      ["参考价", money(s.priceUsd)],
      ["综合分", esc(s.composite.score) + " / 100"],
      ["置信度", pct(s.composite.confidence * 100)],
      ["观察范围", esc(s.composite.horizon)],
    ]) +
      `<p>${esc(s.composite.interpretation)}</p><svg class="research-chart" viewBox="0 0 680 190" role="img" aria-label="研究样本的风险分数曲线"><line x1="42" y1="160" x2="638" y2="160"/><polyline points="${s.curve.map((p, i) => `${50 + i * 200},${160 - p.score * 1.18}`).join(" ")}"/>${s.curve.map((p, i) => `<text x="${40 + i * 200}" y="183">${esc(p.label)}</text><text x="${40 + i * 200}" y="${148 - p.score * 1.18}">${esc(p.score)}</text>`).join("")}</svg>`,
  )}${panel(
    "研究建议",
    badge(s.recommendation.stance) +
      `<h3>${esc(s.recommendation.action)}</h3><p>${esc(s.recommendation.rationale)}</p>${facts(
        [
          ["当前 ETH 敞口", pct(s.recommendation.currentExposurePct)],
          ["目标 ETH 敞口", pct(s.recommendation.targetExposurePct)],
          ["建议置信度", pct(s.recommendation.confidence * 100)],
        ],
      )}<p class="note">研究输出不批准或执行交易；分数与置信度不是经校准的下跌概率。</p>`,
    "dark-panel",
  )}</div><section class="workspace-panel"><h2>观察输入</h2><div class="research-metrics">${s.metrics.map((m) => `<article><div>${badge(m.state)}</div><h3>${esc(m.label)}</h3><strong>${esc(m.display)}</strong><small>${esc(m.unit)} / ${esc(m.direction)}</small><div class="meter"><i style="width:${m.percentile}%"></i></div><p>${esc(m.rationale)}</p></article>`).join("")}</div></section><section class="workspace-panel"><h2>模型与依据</h2><div class="model-grid">${s.models.map((m) => `<article><div class="model-heading"><h3>${esc(m.title)}</h3><strong>${m.score}</strong></div><p>${esc(m.method)} / Confidence ${pct(m.confidence * 100)}</p><p>${esc(m.output)}</p><code class="formula-block">${esc(m.formula)}</code><p>${esc(m.rationale)}</p>${list(m.inputs)}<small>${esc(m.citation)}</small></article>`).join("")}</div></section>${panel("数据出处与限制", s.evidence.map((e) => `<div class="evidence-row">${badge(e.status)}<h3>${esc(e.label)}</h3><p>${esc(e.value)}</p><small>${esc(e.source)}</small></div>`).join("") + `<p class="note">区块范围 ${s.blockRange.from} – ${s.blockRange.to}。当前 fixture 的“OBSERVED”仅指样本中的观测项，不能当作本次真实 RPC 读取。</p>` + rawDetails(s))}<a class="button-primary" href="/attestations?source=research">固定研究报告并存证</a>`;
}
export function researchPage(root,kind){const config = {
    investigate: [
      "交易核验",
      "核对一笔 Ethereum 交易的外层事实与指定池兑换，保留能够确认和不能确认的边界。",
    ],
    position: [
      "Aave 仓位",
      "独立读取 Ethereum / Aave V3 仓位与预言机价格，不执行交易。",
    ],
    "risk-lab": [
      "ETH 风险研究",
      "用同一份研究样本观察卖压、波动、杠杆、泡沫与左尾风险。",
    ],
  }[kind];
root.innerHTML =
    pageHead(...config) +
    `<nav class="context-links"><a href="/coins/ETH">ETH 数据与指纹</a><a href="/investigate">交易核验</a><a href="/risk-lab">风险研究</a><a href="/position">Aave 仓位</a><a href="/attestations">报告存证</a></nav>${kind === "risk-lab" ? '<div class="notice">当前接口为明确标记的研究样本，不是实时预测，也没有真实 AI 调查。</div><button class="button-secondary" data-research="reload">重读研究样本</button>' : `<form class="query-form" id="research-query"><label for="query-value">${kind === "position" ? "Ethereum 钱包地址" : "Ethereum 交易哈希"}</label><div class="query-row"><input id="query-value" name="value" required spellcheck="false" autocomplete="off" placeholder="${kind === "position" ? "0x + 40 位十六进制字符" : "0x + 64 位十六进制字符"}"><button class="button-primary" type="submit">${kind === "position" ? "读取只读仓位" : "核验这笔交易"}</button><button type="button" class="button-secondary" data-research="example">填入示例</button></div><p class="note">仅从配置的主网 RPC 读取；未配置或读取失败时不回退 Mock。${kind === "investigate" ? "目前仅解析 Uniswap V3 WETH/USDC 0.05% 池，不推断身份或后续去向。" : ""}</p></form>`}<p id="research-error" class="error-band" role="alert" hidden></p><div id="research-result"></div>`;}