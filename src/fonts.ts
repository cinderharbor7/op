import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
export const fontsReady = Promise.all([
  loadFont({
    family: "SF Mono",
    url: staticFile("fonts/SF-Mono-Regular.otf"),
    weight: "400",
  }),
  loadFont({
    family: "SF Mono",
    url: staticFile("fonts/SF-Mono-Medium.otf"),
    weight: "500",
  }),
  loadFont({
    family: "SF Mono",
    url: staticFile("fonts/SF-Mono-Semibold.otf"),
    weight: "600",
  }),
  loadFont({
    family: "SF Mono",
    url: staticFile("fonts/SF-Mono-Bold.otf"),
    weight: "700",
  }),
  loadFont({
    family: "PingFang SC",
    url: staticFile("fonts/PingFangSC-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "PingFang SC",
    url: staticFile("fonts/PingFangSC-Medium.ttf"),
    weight: "500",
  }),
  loadFont({
    family: "PingFang SC",
    url: staticFile("fonts/PingFangSC-Semibold.ttf"),
    weight: "600",
  }),
]);
