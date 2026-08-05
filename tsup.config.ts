import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: true,
    clean: true,
    target: "es2020",
    outDir: "dist",
    sourcemap: false,
    minify: true,
});
