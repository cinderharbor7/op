# 23rd components used in the film

Source: https://github.com/radiumcoders/23rd.dev
Docs: https://23rd.dev/docs/components/ascii-fluid and https://23rd.dev/docs/components/radiant-lines
Registry snapshots downloaded 2026-10-07 from https://23rd.dev/r/ascii-fluid.json and https://23rd.dev/r/radiant-lines.json. Original source preserved alongside the registry JSON.

ASCII Fluid adaptation: original VERT, FRAG_DISPLAY, brightness charset, and buildAtlas are extracted by scripts/extract-23rd.mjs. The atlas uses the requested SF Mono Regular. Instead of accumulating pointer-driven fluid simulation over wall-clock time, the dye texture is generated from deterministic frame-driven density fields. The original glyph sampling, brightness quantization and halo shader are retained.

Radiant Lines adaptation: preserves perspective x=focal*x/z, y=focal*y/z and depth-based opacity; uses a deterministic seed and absolute frame time instead of Math.random and requestAnimationFrame. Pixel heads replace round heads; speed is reduced for the calm catalogue introduction.
