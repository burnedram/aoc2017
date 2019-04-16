const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NoEmitWebpackPlugin = require('no-emit-webpack-plugin');

function getPage(page) {
    return path.dirname(page.split(path.sep).slice(1).join(path.sep));
}

function createConfig(page) {
    return {
        entry: './src/entry.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
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
                    test: /index\.ts$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: { 
                                name: '[name].js',
                                outputPath: (url, resourcePath, context) => {
                                    const relativePath = path.dirname(path.relative(path.resolve(__dirname, 'src'), resourcePath));
                                    return `${relativePath}/${url}`;
                                },
                                publicPath: (url, resourcePath, context) => {
                                    return 'FIXME.js';
                                }
                             }
                        },
                        'extract-loader',
                        path.resolve('js-loader.js')
                    ]
                },
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: { transpileOnly: true }
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: { pretty: true, root: path.resolve(__dirname, 'src') }
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].css',
                                outputPath: (url, resourcePath, context) => {
                                    const relativePath = path.dirname(path.relative(path.resolve(__dirname, 'src'), resourcePath));
                                    return `${relativePath}/${url}`;
                                },
                                publicPath: (url, resourcePath, context) => {
                                    return 'FIXME.css';
                                }
                            }
                        },
                        'extract-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: { paths: ['./src'] }
                        }
                    ]
                },
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
                filename: `${page}/index.html`,
                template: `./src/${page}/index.pug`,
                inject: false
            }),
            new NoEmitWebpackPlugin()
        ]
    };
};

module.exports = glob.sync('src/**/index.pug')
        .map(getPage)
        .map(createConfig);