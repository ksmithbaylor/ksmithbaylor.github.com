import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
if (!["development", "production"].includes(NODE_ENV)) {
  throw new Error("Invalid NODE_ENV");
}

const PROD = NODE_ENV === "production";
const OUTPUT_DIR = {
  production: path.join(__dirname, "dist", "main.js"),
  development: path.join(__dirname, "site", "static", "main.js")
}[NODE_ENV];

const plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: "node_modules/**" // only transpile our source code
  })
];

const prodPlugins = [uglify()];

export default {
  entry: "src/index.js",
  format: "iife",
  context: "window",
  plugins: PROD ? plugins.concat(prodPlugins) : plugins,
  dest: OUTPUT_DIR
};
