const path = require("path");
const webpack = require('webpack');
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const pkg = require("./package.json");

module.exports = {
  target: "node",
  mode: "production",
  entry: pkg.source,
  externals: [
    nodeExternals({
      whitelist: [/@glennsl\/bs-json/, /bs\-platform/]
    })
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false
        }
      }),
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
    ]
  }
};
