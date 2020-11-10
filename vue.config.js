const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'json'];
const tsImportPluginFactory = require('ts-import-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath:'./',
    lintOnSave: true,
    transpileDependencies: [
        "@suc/authox/plugins/authox-vue",
        /vue-ol/gi,
        'vue-echarts',
        'resize-detector'
    ],
    chainWebpack: config => {
        config.resolve.alias
            .set("@manage", resolve("src"))

    },
    devServer: {
        port:8023,
        proxy: {
            //devops.sucsoft.com:31821/doc.html   一户一档
            //devops.sucsoft.com:30119/doc.html   收款
            "/apbb/": {
                // target: "http://172.18.45.4:8200",
                target: "http://172.18.20.106:5121",
                changeOrigin: true,
                pathRewrite: {
                    "^/apbb": ""
                }
            },
            //线上
            "/apnn/": {
                target: "http://devops.sucsoft.com:32162",
                changeOrigin: true,
                pathRewrite: {
                    "^/apnn": ""
                }
            },
            "/api/": {
                target: "http://devops.sucsoft.com:31789",
                //target: "http://172.18.20.106:5118",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            },

        }
    },
    configureWebpack: {
        // devtool: false,
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 1000,
                minChunks: 1,
                maxAsyncRequests: 10,
                maxInitialRequests: 5,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 1,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    dll: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|iview)[\\/]/,
                        name: 'dll',
                        chunks: 'all',
                    },
                },
            },
        },
        plugins: [
            new CompressionWebpackPlugin({
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                deleteOriginalAssets: false
            }),
            new WebpackNotifierPlugin({alwaysNotify: true}),
            /*new BundleAnalyzerPlugin({
                analyzerPort: 6543
            })*/
        ]
    },
};
