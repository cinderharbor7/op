# VERDANT · Remotion 视频

当前主线 **102 秒 / 1920×1080 / 30fps**，以 `../xjy/web` 原 HTML、CSS、指纹绘制器为视觉真源。中文为苹方 400/500/600，英文与数字为 SF Mono 系列。

## 预览与结构

```powershell
npm install
npm run dev
```

打开 http://localhost:3016/VERDANT-Film 。静态页面已经编译至 `public/site/`，播放不依赖原站 3000 端口。静态包更新后刷新 Studio。

| 时间 | Composition | 当前内容 |
| --- | --- | --- |
| 00:00–00:16 | 00-Opening | 半尺寸指纹、双向心跳转化、币名与类型、主题色、原主页显现、SF Mono 项目名出场并保持 |
| 00:16–00:44 | 01-Fingerprint | 资产图鉴、2× ETH 点击、详情数据、市场轨迹、情绪温度、指纹构成、查看映射 |
| 00:44–01:10 | 02-03-RiskResearch | 从风险研究页顶端向下巡视；接近出处区加速到底，推近并点击固定研究报告按钮，缩小转场 |
| 01:10–01:18 | 04-Attestations | 报告存证页落版并保持 |
| 01:18–01:30 | 05-Wallet | 原钱包授权片段，保留未改 |
| 01:30–01:42 | 06-Preserve | 原收藏与存证片段，保留未改 |

旧的交易核验、单独风险研究和保护模板保存在 `Previous-Templates`；05、06 仍在主线，等待用户后续逐段修改。

## 修改位置

- `src/film/Opening.tsx`、`ProjectName.tsx`：开场与 Builder 风格字母出场。
- `src/film/FingerprintFlow.tsx`、`DataPanels.tsx`：01 时序、单板块呈现、曲线与鼠标。
- `src/film/RiskTour.tsx`、`AttestationsLanding.tsx`：合并巡视与报告存证落版。
- `src/NativePage.tsx`、`native/bridge.js`：原 DOM 镜头、隔离呈现、帧同步。
- `src/SpaceBackground.tsx`：23rd ASCII 着色器适配与缓慢像素星场。
- `src/Root.tsx`：总时间线与独立 Composition。
- `scripts/music.py`：102 秒原创节拍与 0.22 秒点击音效（uv / Python 标准库）。

## 构建与检查

```powershell
npm run native:build
npm run lint
npm run verify
npm run verify:native
```

`native:build` 从相邻 xjy 原源码提取函数与 CSS，需要该项目现有 Vite/Tailwind 开发依赖。`verify` 渲染当前镜头关键帧；可传 Composition ID 进行定向复查。检查记录在 `qa/00-01-v4/`。原绘制器一致性记录仍在 `qa/native-fidelity.json`。

## 素材与边界

23rd ASCII Fluid 的原亮度字符映射、图集及显示着色器已实际接入；将实时交互仿真替换为帧驱动密度场。Radiant Lines 的透视投影用于慢速像素星场。源码快照、出处与改动说明在 `third-party/23rd/`。

`01` 图表使用项目 `sampleHistory()` 演示数据；曲线下方渐变保留。情绪为项目演示值 68，代表全市场背景，不是 ETH 专属评分。风险研究使用原 MOCK_CHAIN_FIXTURE。所有点击均为视频模拟，不签名、不交易、不写入原项目状态。本轮修改范围止于报告存证页；05、06 保持原有内容继续接在主线之后。

当前未导出正式 MP4，需要时：

```powershell
npm run render:film
```
