const merge = require('webpack-merge');
const baseConfigs = require('./webpack.config.base');

module.exports = baseConfigs.map(c => merge(c, {
    mode: 'production'
}));