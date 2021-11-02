const withPrefresh = require('@prefresh/next');
const path = require('path');

const config = {
	webpack(config, { dev, isServer }) {
		// Install webpack aliases:
		const aliases = config.resolve.alias || (config.resolve.alias = {});
		aliases.react = aliases['react-dom'] = 'preact/compat';
		aliases.preact = path.resolve(__dirname, 'node_modules', 'preact');
		aliases['preact/hooks'] = 'preact/compat'

		return config;
	}
};

module.exports = withPrefresh(config);
