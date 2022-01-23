const withPrefresh = require('@prefresh/next');
const path = require('path');

const config = {
	experimental: {
		modern: true,
    polyfillsOptimization: true,
  },
  future: {
    webpack5: true,
  },
	webpack(config, { isServer }) {
		const splitChunks = config.optimization && config.optimization.splitChunks;
		if (splitChunks && isServer && splitChunks.cacheGroups) {
			const cacheGroups = splitChunks.cacheGroups;
			const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;

			if (cacheGroups.framework) {
				cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
					test: preactModules
				});
				cacheGroups.commons.name = 'framework';
			} else {
				cacheGroups.preact = {
					name: 'commons',
					chunks: 'all',
					test: preactModules
				};
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
