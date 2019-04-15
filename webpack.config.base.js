const path = require('path');
const glob = require('glob');

const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getPage(page) {
    return path.dirname(page.split(path.sep).slice(1).join(path.sep));
}

function createConfig(page) {
    return {
        entry: `./src/${page}/index.ts`,
        output: {
            path: path.resolve(__dirname, `dist/${page}`),
            filename: 'bundle.js',
            publicPath: ''
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
                }
            ]
        },
        plugins: [
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
            })
        ]
    };
};

module.exports = glob.sync('src/**/index.html')
        .map(getPage)
        .map(createConfig);