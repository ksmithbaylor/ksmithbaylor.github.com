const webpack = require("webpack");
const path = require("path");

const fail = (msg) => { throw new Error(msg); };

const NODE_ENV = process.env.NODE_ENV;
const OUTPUT_DIR = {
  production: path.join(__dirname, "dist"),
  development: path.join(__dirname, "site", "static")
}[NODE_ENV] || fail("Invalid NODE_ENV");

module.exports = {
  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },
      {test: /\.json$/, loader: "json-loader"},
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports-loader?this=>global!exports?global.fetch!whatwg-fetch"
    })
  ],

  context: path.join(__dirname, "src"),
  entry: {
    main: ["promise-polyfill", "."]
  },
  output: {
    path: OUTPUT_DIR,
    publicPath: "/",
    filename: "[name].js"
  },
  externals:  [/^vendor\/.+\.js$/]
};
