import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    entry: [
      "src/run.mts"
    ],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    noExternal: [
      'arg',
      '@npmcli/package-json',
      'execa'
    ]
  }
])