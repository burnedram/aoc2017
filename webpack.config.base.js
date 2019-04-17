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
    const relativePath = path.dirname(path.relative('./src', page));
    return relativePath;
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
                    options: {
                        pretty: true,
                        root: path.resolve(__dirname, 'src'),
                        plugins: [{
                            postLoad: ast => {
                                const walk = require('pug-walk');
                                const tags = [];
                                walk(ast, (node, replace) => {
                                    if (node.type === 'Tag') {
                                        tags.push(node.name);
                                    }
                                }, { includeDependencies: true });
                                const components = [];
                                new Set(tags).forEach(tag => {
                                    const templates = glob.sync(`./src/components/**/${tag}/${tag}.pug`);
                                    if (templates.length > 1) {
                                        throw new Error(`multiple components with name "${tag}" found`);
                                    }
                                    if (templates[0]) {
                                        const pugPath = path.relative('./src', templates[0]);
                                        components.push(`@/${pugPath}`);
                                    }
                                });
                                return walk(ast, null, function(node, replace) {
                                    if (node.type === 'NamedBlock' && node.name === 'content' && node.nodes) {
                                        node.nodes.unshift(components.map(comp => {
                                            return {
                                                type: 'Code',
                                                val: `require("${comp}").call(this, locals)`,
                                                buffer: true,
                                                mustEscape: false,
                                                isInline: false,
                                                line: node.line,
                                                filename: node.filename
                                            };
                                        }))
                                    }
                                }, { includeDependencies: true });
                            }
                        }]
                     }
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

module.exports = glob.sync('./src/**/index.pug')
        .map(getPage)
        .map(createConfig);