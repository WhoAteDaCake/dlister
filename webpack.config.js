const path = require("path");
const nodeExternals = require("webpack-node-externals");
const mode = process.env.NODE_ENV || "development";
const pkg = require('./package.json');

module.exports = {
  target: "node",
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
		// We no not want to minimize our code.
    minimize: false,
    usedExports: true
	},
  mode
};
