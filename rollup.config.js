import path from "path";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const distDir = path.resolve(__dirname, "dist");

export default {
  input: path.resolve(__dirname, "src", "index.ts"),
  plugins: [typescript(), commonjs(), nodeResolve(), terser(), sizeSnapshot()],
  external: ["react", "react-dom"],
  output: [
    {
      format: "es",
      file: path.resolve(distDir, "index.js"),
    },
  ],
};
