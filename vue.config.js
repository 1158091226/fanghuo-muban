"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title || "vue Element Admin"; // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); //这个是用于在控制台展示编译时间的
const smp = new SpeedMeasurePlugin(); //这个是用于在控制台展示编译时间的
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin"); //提供缓存，让项目在第二次编译的时候大大节省时间
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false /* devServer: {
      port: port,
      open: true,
      overlay: {
          warnings: false,
          errors: true
      },
      before: require('./mock/mock-server.js')
  }, */,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      }, // "/forestry-basic-system": { //   target: "http://192.168.3.11:8001/micro/forestry-basic-system", //   changeOrigin: true, //   pathRewrite: { //     "/forestry-basic-system": "/", //   }, // },
      "/ceshi": {
        target: "http://192.168.3.11:8001/micro/",
        changeOrigin: true,
        pathRewrite: {
          "/ceshi": "/",
        },
      },
    },
  },
  configureWebpack: (conifg) => {
    if (process.env.ENV !== "production") {
      return smp.wrap({
        // ...其他的webpack配置
        name: name,
        resolve: {
          alias: {
            "@": resolve("src"),
          },
        },
        optimization: {
          splitChunks: {
            chunks: "all", // 代码拆分
          },
        },
      });
    } else {
      return {
        name: name,
        resolve: {
          alias: {
            "@": resolve("src"),
          },
        },
      };
    }
  },
  chainWebpack(config) {
    if (process.env.ENV !== "production") {
      // config
      //   .plugin("webpack-bundle-analyzer")
      //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
      //   .end(); // 针对 JavaScript 文件配置 thread-loader 和 cache-loader
      config.module
        .rule("js")
        .use("cache-loader")
        .loader("cache-loader")
        .end()
        .use("thread-loader")
        .loader("thread-loader")
        .options({
          // 可以在这里配置 thread-loader 的选项
          // workers: 2, // 指定线程数
        })
        .end(); // 针对 Vue 文件配置 thread-loader 和 cache-loader
      config.module
        .rule("vue")
        .use("cache-loader")
        .loader("cache-loader")
        .end()
        .use("thread-loader")
        .loader("thread-loader")
        .options({
          // 可以在这里配置 thread-loader 的选项
          // workers: 2, // 指定线程数
        })
        .end();
      config.plugins.delete("prefetch");
    } // it can improve the speed of the first screen, it is recommended to turn on preload // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload", // to ignore runtime.js // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]); // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch"); // set svg-sprite-loader
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
    config.module
      .rule("pdf")
      .test(/\.pdf$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 2,
        name: "files/[name].[ext]",
      });
    if (process.env.NODE_ENV === "development") {
      config.module
        .rule("eslint")
        .use("eslint-loader")
        .loader("eslint-loader")
        .tap((options) => {
          options.fix = true;
          return options;
        });
    }
    config.when(process.env.NODE_ENV !== "development", (config) => {
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
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }); // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
    config.when(process.env.NODE_ENV == "development", (config) => {
      // config.plugin("HardSourceWebpackPlugin").use(HardSourceWebpackPlugin); //这个就是是否要开启缓存，开启后虽说第二次启动项目更快了，但是热重载感觉却变慢了，就是保存后自动更新的功能。有点得不偿失，所以选择不开启缓存
    });
  },
};
