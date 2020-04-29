const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate } = require('./createTemplate');
const { injectEntry } = require('./utils');

class ReloadPlugin {

  apply(compiler) {
    compiler.options.entry = injectEntry(compiler.options.entry);

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.mainTemplate.hooks.require.tap(
        this.constructor.name,
        createRefreshTemplate
      )
    });
  }
}

module.exports = ReloadPlugin;
