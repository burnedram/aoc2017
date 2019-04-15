const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getPage(page) {
    return path.dirname(page.split(path.sep).slice(1).join(path.sep));
}

function createConfig(page) {
    return {
        entry: [
            `./src/${page}/index.ts`,
            `./src/${page}/index.less`,
        ],
        output: {
            path: path.resolve(__dirname, `dist/${page}`),
            filename: 'scripts.js'
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            plugins: [
                new TsconfigPathsWebpackPlugin({
                    configFile: './tsconfig.json'
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: { transpileOnly: true }
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: { paths: ['./src'] }
                        }
                    ]
                }
            ]
        },
        optimization: {
            minimizer: [
                new TerserWebpackPlugin(),
                new OptimizeCSSAssetsPlugin()
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: './tsconfig.json',
                tslint: './tslint.json',
                useTypescriptIncrementalApi: true
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: `./src/${page}/index.html`,
                inject: 'head'
            }),
            new MiniCssExtractPlugin({
                filename: 'styles.css'
            })
        ]
    };
};

module.exports = glob.sync('src/**/index.html')
        .map(getPage)
        .map(createConfig);