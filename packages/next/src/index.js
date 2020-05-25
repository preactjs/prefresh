const Prefresh = require('./plugin');

module.exports = (nextConfig = {}) => {
	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			if (options.dev && !options.isServer) {
				const reactRefresh = config.plugins.find(
					s => s.constructor.name === 'ReactFreshWebpackPlugin'
				);
				if (reactRefresh) {
					config.plugins.splice(config.plugins.indexOf(reactRefresh), 1);
				}
				config.plugins.unshift(new Prefresh());
			}

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, options);
			}

			return config;
		}
	});
};
