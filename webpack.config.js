const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

var demo_src = process.env.DEMO;

module.exports = {
    mode: process.env.MODE || "development",
    entry: ['absol-acomp/dev',"./src/vchart.js"],
    output: {
        path: path.join(__dirname, "."),
        filename: "./dist/vchart.js"
    },
    resolve: {
        modules: [
            './node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"]//,
                    // plugins: [
                    //     'transform-jsx-to-absol'
                    //     // ,
                    //     // '@babel/transform-literals'
                    // ]
                }
            },
            {
                test: /\.(tpl|txt|xml|rels|svg)$/i,
                use: 'raw-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    devServer: {
        compress: true,
        host: '0.0.0.0',
        disableHostCheck: true
    },
    performance: {
        hints: false
    },
    optimization: {
        // We don't want to minimize our code.
        minimize: false
    },
};