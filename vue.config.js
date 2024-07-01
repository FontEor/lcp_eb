"use strict";
const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

let [currentCommand] = process.env.npm_lifecycle_event.split(":").slice(-1);
[currentCommand] = currentCommand.split("-").slice(0);
console.log("currentCommand", currentCommand);

const name =
  currentCommand === "international"
    ? "京东物流开放平台国际站"
    : "京东物流开放平台"; // page title

const pagesHashMap = {
  national: {
    index: {
      entry: "pages/national/main.js",
      template: "pages/national/index.html",
      filename: "index.html",
    },
  },
  international: {
    index: {
      entry: "pages/international/main.js",
      template: "pages/international/index.html",
      filename: "index.html",
    },
  },
};

const pages = pagesHashMap[currentCommand] || pagesHashMap.national;

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  pages,
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/admin",
  outputDir:
    currentCommand === "international" ? "dist/international" : "dist/lcp_web",
  lintOnSave: false,
  runtimeCompiler: false,
  productionSourceMap: false,
  devServer: {
    port: 8081,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/lcp-rest/mock": {
        target: "http://11.51.194.248:3000",
        changeOrigin: true,
        pathRewrite: { "/lcp-rest": "" },
      },
      "/mock/5": {
        target: "http://11.51.194.248:3000",
        changeOrigin: true,
      },
      "/lcp-rest": {
        target:
          "http://lcp-server-rest-devtest.jdl-wly.svc.wlzyxtest.n.jd.local",
        // "http://11.158.5.8:8080",
        changeOrigin: true,
        pathRewrite: { "/lcp-rest": "" },
      },
    },
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    optimization: {
      minimize: process.env.NODE_ENV === "production",
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              // drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.info", "console.debug"],
            },
          },
        }),
      ],
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ["json", "xml", "html"],
      }),
    ],
  },

  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    config.resolve.alias
      .set("public", resolve("public"))
      .set("pages", resolve("pages"));

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", (config) =>
        config.devtool("cheap-source-map")
      );

    config
      .plugin("ScriptExtHtmlWebpackPlugin")
      .after("html")
      .use("script-ext-html-webpack-plugin", [
        {
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/,
        },
      ])
      .end();
    // config.optimization.splitChunks({
    //   chunks: "all",
    //   cacheGroups: {
    //     libs: {
    //       name: "chunk-libs",
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: "initial", // only package third parties that are initially dependent,
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     },
    //     // elementUI: {
    //     //   name: "chunk-elementUI", // split elementUI into a single package
    //     //   priority: 1, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //     //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
    //     //   minSize: 0,
    //     //   maxSize: 1024 * 1024
    //     // },
    //     LUI: {
    //       name: "chunk-LUI", // split elementUI into a single package
    //       priority: 1, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //       test: /[\\/]node_modules[\\/]@lui[\\/]lui-ui/, // in order to adapt to cnpm
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     },
    //     commons: {
    //       name: "chunk-commons",
    //       test: resolve("src/components"), // can customize your rules
    //       minChunks: 3, //  minimum common number
    //       priority: 5,
    //       reuseExistingChunk: true,
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     },
    //     UmyUI: {
    //       name: "chunk-UmyUI", // split elementUI into a single package
    //       priority: 15, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //       test: /[\\/]node_modules[\\/]umy-ui/, // in order to adapt to cnpm
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     }
    //   }
    // });
    // config.optimization.runtimeChunk("single");
  },
};
