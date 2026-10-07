import {esc,money,pct,time,pageHead,badge,panel,list,table,facts,explorer,rawDetails,assetTag} from '../../../xjy/web/ui.js';
import {ExecutionBadge,VerificationBadge,VerificationDetails,StressChart} from '../../../xjy/web/pages/rescue-display.js';
export function sessionHTML(session, status) {
  const {
    before,
    riskAnalysis: risk,
    policyDecision: policy,
    execution,
    after,
    verification,
  } = session;
  const positions = (p) =>
    table(
      ["币种 / 指纹", "数量", "价值 / USD", "角色"],
      p.assets.map((a) => [
        assetTag(a.symbol),
        esc(a.amount),
        money(a.usdValue),
        esc(a.category),
      ]),
    );
  return `<div class="workspace-section-title"><h2>本次观察与执行</h2>${VerificationBadge({ verification })}</div><div class="workspace-grid">${panel(
    "执行前组合",
    facts([
      ["组合估值", money(before.totalUsd)],
      ["风险敞口", pct(before.riskExposurePct)],
    ]) + positions(before),
  )}${panel(
    "风险与调查",
    facts([
      ["Risk Score", esc(risk.riskScore) + " / 100"],
      ["Confidence", pct(risk.confidence * 100)],
    ]) +
      `<p>${esc(risk.investigation.summary)}</p><h3>主要原因</h3><p>${esc(risk.investigation.primaryCause)}</p><h3>证据</h3>${list(risk.investigation.evidence)}<h3>不确定性</h3>${list(risk.investigation.uncertainties)}`,
    "dark-panel",
  )}
  ${panel("压力情景", `<p class="note">基于 Before 风险资产的进一步冲击，不是未来价格预测。</p>${StressChart({ tests: risk.stressTests, baselineUsd: before.totalUsd })}`, "wide")}
  ${panel(
    "策略门控",
    badge(
      policy.triggered ? "获批单向减仓" : "未批准执行",
      policy.triggered ? "warn" : "",
    ) +
      facts([
        [
          "方向",
          `${esc(policy.sourceAsset || "—")} → ${esc(policy.targetAsset || "—")}`,
        ],
        [
          "降低敞口",
          policy.reduceExposurePct == null
            ? "—"
            : esc(policy.reduceExposurePct) + " 个百分点",
        ],
      ]) +
      list(policy.reasons),
  )}
  ${panel("执行记录", ExecutionBadge({ execution, pending: status.events.find((e) => e.id === status.activeEvent)?.status === "SUBMITTED_UNKNOWN" }) + `<p>${esc(execution.error || `${status.mode} / ${execution.action}`)}</p>${execution.txHash ? `<p><code>${esc(execution.txHash)}</code></p>` : ""}<p class="note">${status.mode === "FORK" ? "本地 Fork 交易，无主网交易链接。" : "Mock 执行，没有真实链上交易。"}</p>`)}
  ${panel(
    "执行后独立读取",
    after
      ? facts([
          ["执行后估值", money(after.totalUsd)],
          ["风险敞口", pct(after.riskExposurePct)],
          ["读取时间", time(after.timestamp)],
        ]) + positions(after)
      : "<p>未完成执行后的独立读取，不声称保护成功。</p>",
    "wide",
  )}
  ${panel("结果核验", VerificationDetails({ verification }), "wide")}</div>`;
}
export function guardianPage(root,status,policy,session){root.innerHTML =
    pageHead(
      "保护实验",
      "保留单钱包策略门控、事件去重与独立结果核验。行情指纹不构成交易授权。",
    ) +
    `<div class="notice">此功能仅支持既有 ETH → USDC 保护实验。真实行情指纹不会驱动后台交易；运行模式由服务端配置。</div><div id="guardian-state" class="loading">正在读取本机状态…</div><div id="guardian-controls"></div><p id="guardian-message" role="status" class="note"></p><div id="guardian-results"></div>`;
const fields = [
    ["minRiskScore", "风险分数高于", 1],
    ["minConfidence", "置信度高于 / %", 100],
    ["minRiskExposurePct", "风险敞口高于 / %", 1],
    ["maxDeRiskPct", "最大减仓 / 百分点", 1],
  ];
root.querySelector("#guardian-controls").innerHTML =
      `<div class="workspace-grid">${panel("观察与监控", `<label>受保护钱包<input readonly value="${esc(status.wallet)}"></label><div class="action-row"><button class="button-primary" data-guardian="run">运行一次保护流程</button><button class="button-secondary" data-guardian="start">启动监控</button><button class="button-secondary" data-guardian="pause">暂停监控</button></div><p class="note">单次运行与后台监控均可能按已保存策略执行一次 ${esc(status.mode)} 减仓。暂停不撤销已经广播的交易。</p><p class="note">恢复阈值为演示规则：连续 3 个新鲜样本，波动代理 ≤40、5m ≥−0.5%、1h ≥−2%。</p>`)}${panel("策略配置", `<form id="policy-form"><div class="form-grid">${fields.map(([key, label, factor]) => `<label>${label}<input name="${key}" type="number" min="0" max="100" step="0.1" required value="${Number((policy.config[key] * factor).toFixed(6))}"></label>`).join("")}</div><div class="check-row"><label><input type="checkbox" name="allowETH" ${policy.config.allowedRiskAssets.includes("ETH") ? "checked" : ""}> 卖出 ETH（Fork 中为 WETH）</label><label><input type="checkbox" name="allowUSDC" ${policy.config.allowedDefensiveAssets.includes("USDC") ? "checked" : ""}> 接收 USDC</label></div><div class="action-row"><button class="button-primary" type="submit">保存策略</button><button type="button" class="button-secondary" data-guardian="reload">重读已保存配置</button></div><p class="note">已加载 v${policy.version}；保存不执行交易。版本冲突时先重读。</p></form>`)}</div><section class="workspace-panel"><h2>持久化事件</h2><div id="event-history"></div></section>`;
root.querySelector('#guardian-state').innerHTML='<div class="status-band">'+badge('MOCK')+badge('监控暂停')+'</div>';root.querySelector('#event-history').innerHTML='<p class="note">动画沙盒 · 没有连接运行中的监控服务。</p>';if(session)root.querySelector('#guardian-results').innerHTML=sessionHTML(session,status);}