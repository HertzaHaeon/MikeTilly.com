const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const IS_DEV = process.env.NODE_ENV === "development";
const IS_PROD = process.env.NODE_ENV === "production";
const PATHS = {
  BASE: path.resolve(__dirname),
  SRC: path.resolve(__dirname, "src"),
  OUTPUT: path.resolve(__dirname, "dist")
};

module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "js/[name].[hash].js",
    path: PATHS.OUTPUT,
    publicPath: "/"
  },
  resolve: {
    modules: ["node_modules", "src/js/", "src/css/", "src/scss/"],
    extensions: [" ", ".js", ".jsx", ".scss", ".css"],
    alias: {
      component: path.resolve(__dirname, "./src/js/components"),
      img: path.resolve(__dirname, "./assets/img"),
      scss: path.resolve(__dirname, "./src/scss"),
      services: path.resolve(__dirname, "./src/services")
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.SRC, "index.html")
    }),
    new CopyWebpackPlugin(["assets"]),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
      ignoreOrder: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          IS_PROD
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "./css",
                }
              }
            : "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    minimize: IS_PROD,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: PATHS.OUTPUT,
    hot: true
  }
};
