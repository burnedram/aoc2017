const merge = require('webpack-merge');
const baseConfigs = require('./webpack.config.base');

module.exports = baseConfigs.map(c => merge(c, {
    mode: 'development', 
    devtool: 'inline-source-map',
    devServer: {
        open: true
    }
}));