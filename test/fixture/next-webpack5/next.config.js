const withPrefresh = require('@prefresh/next');
const path = require('path');

const config = {
	webpack(config) {
    const splitChunks =
      config.optimization && config.optimization.splitChunks;
    if (splitChunks && splitChunks.cacheGroups) {
      const cacheGroups = splitChunks.cacheGroups;
      const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
          test
        });
      }
    }

		// Install webpack aliases:
		const aliases = config.resolve.alias || (config.resolve.alias = {});
		aliases.react = aliases['react-dom'] = 'preact/compat';
		aliases.preact = path.resolve(__dirname, 'node_modules', 'preact');

		return config;
	}
};

module.exports = withPrefresh(config);
