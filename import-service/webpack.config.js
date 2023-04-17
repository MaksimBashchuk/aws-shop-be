const path = require("path");
const { IgnorePlugin } = require("webpack");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs",
    filename: "[name].js",
    path: path.join(__dirname, ".webpack"),
  },
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  devtool: slsw.lib.webpack.isLocal ? "source-map" : "cheap-source-map",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [
          /node_modules/,
          path.resolve(__dirname, ".webpack"),
          path.resolve(__dirname, ".serverless"),
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
};
