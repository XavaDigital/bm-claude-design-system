import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tokens: "src/tokens/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["react", "react-dom", "antd"],
});
