const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getPage(page) {
    return path.dirname(page.split(path.sep).slice(1).join(path.sep));
}

function createConfig(page) {
    return {
        entry: `./src/${page}/index.js`,
        output: {
            path: path.resolve(__dirname, `dist/${page}`),
            filename: 'bundle.js',
            publicPath: ''
        },
        plugins: [
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