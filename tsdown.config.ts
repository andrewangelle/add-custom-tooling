import { defineConfig } from "tsdown";

export default defineConfig([
  {
    clean: true,
    entry: [
      "src/run.mts"
    ],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    deps: {
      onlyBundle: false
    }
  }
])