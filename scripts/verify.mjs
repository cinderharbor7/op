import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill, openBrowser } from "@remotion/renderer";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
await mkdir("qa/00-01-v4", { recursive: true });
const serveUrl = await bundle({
  entryPoint: resolve("src/index.ts"),
  outDir: resolve("build"),
  rspack: true,
});
const browser = await openBrowser("chrome", {
  chromiumOptions: { gl: "angle" },
});
const logs = [];
const onBrowserLog = (log) => {
  if (log.type === "error") logs.push(log.text);
};
try {
  const compositions = await getCompositions(serveUrl, {
    puppeteerInstance: browser,
  });
  const checks = [
    ...[112,145,172,199,220,270,361,395,425,479].map(f=>['00-Opening',f]),
    ...[40,128,142,215,320,395,512,657,722,785].map(f=>['01-Fingerprint',f]),
    ...[50,250,460,596,640,695,706,748,778].map(f=>['02-03-RiskResearch',f]),
    ...[0,60,239].map(f=>['04-Attestations',f]),
  ].filter(([id])=>!process.argv[2]||id===process.argv[2]);
  for (const [id, frame] of checks) {
    const composition = compositions.find((c) => c.id === id);
    await renderStill({
      serveUrl,
      composition,
      frame,
      output: `qa/00-01-v4/${id}-${frame}.png`,
      scale: 0.75,
      puppeteerInstance: browser,
      onBrowserLog,
      chromiumOptions: { gl: "angle" },
    });
    console.log(`Rendered ${id} / ${frame}`);
  }
  await writeFile(
    process.argv[2] ? `qa/00-01-v4/verification-${process.argv[2]}.json` : "qa/00-01-v4/verification.json",
    JSON.stringify(
      {
        compositions: compositions.map(
          ({ id, width, height, fps, durationInFrames }) => ({
            id,
            width,
            height,
            fps,
            durationInFrames,
          }),
        ),
        rendered: checks,
        errors: logs,
        videoExported: false,
      },
      null,
      2,
    ),
  );
  if (logs.length) throw new Error(logs.join("\n"));
} finally {
  await browser.close({ silent: true });
}
