const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// The browser only talks to the dev server; it forwards API and image
// requests, so downloads stay same-origin and no host is baked into the bundle.
const apiUrl = process.env.API_URL || "http://localhost:8888";

module.exports = {
  entry: "./src/refactor-this/app.js",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/refactor-this/index.html" }),
  ],
  // React 19 + the router minify to ~260 KiB, just over webpack's 244 KiB hint.
  performance: {
    maxAssetSize: 300 * 1024,
    maxEntrypointSize: 300 * 1024,
  },
  devServer: {
    host: process.env.HOST || "localhost",
    static: false,
    port: 3000,
    historyApiFallback: true,
    proxy: [{ context: ["/images", "/static"], target: apiUrl }],
  },
};
