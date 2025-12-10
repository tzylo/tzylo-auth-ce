import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  minify: false,
});
