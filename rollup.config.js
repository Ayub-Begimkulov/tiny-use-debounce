import path from "path";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const distDir = path.resolve(__dirname, "dist");

const createRollupConfig = ({ modern }) => {
  return {
    input: path.resolve(__dirname, "src", "index.ts"),
    plugins: [
      typescript(!modern && { tsconfig: "./tsconfig.ie11.json" }),
      terser({
        output: {
          comments: false,
        },
      }),
      sizeSnapshot(),
    ],
    external: ["react", "react-dom"],
    output: [
      {
        format: "es",
        file: path.resolve(distDir, modern ? "index.js" : "index.ie11.js"),
      },
    ],
  };
};

export default [
  createRollupConfig({ modern: true }),
  createRollupConfig({ modern: false }),
];
