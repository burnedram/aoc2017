'use strict';

const uuidv4 = require('uuid/v4');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

module.exports = function jsLoader() {}

module.exports.pitch = function pitch(request) {
  if (!this.webpack) {
    throw new Error('Only usable with webpack.');
  }

  const callback = this.async();
  const filename = `${uuidv4()}.js`;

  const outputOptions = {
    filename,
    chunkFilename: `[id].{filename}`,
    namedChunkFilename: null,
  };

  const jsCompiler = this._compilation.createChildCompiler('js', outputOptions);
  jsCompiler.apply(new SingleEntryPlugin(this.context, `!!${request}`, 'main'));
  jsCompiler.runAsChild((err, entries, compilation) => {
    if (err) return callback(err);
    if (!entries[0]) return callback(null, null);

    const jsFile = entries[0].files[0];
    // omit default outputs
    delete this._compilation.assets[jsFile];
    return callback(null, `module.exports = ${JSON.stringify(compilation.assets[jsFile].source())}`);
  });
}