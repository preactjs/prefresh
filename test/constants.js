const path = require('path');

exports.integrations = ['vite', 'snowpack', 'webpack'];

exports.bin = {
	snowpack: dir =>
		path.resolve(dir, `./node_modules/snowpack/dist-node/index.bin.js`),
	vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
	webpack: dir =>
		path.resolve(
			dir,
			`./node_modules/webpack-dev-server/bin/webpack-dev-server.js`
		)
};

exports.binArgs = {
	snowpack: ['dev'],
	webpack: [],
	vite: []
};

exports.goMessage = {
	vite: 'running',
	snowpack: 'Server started',
	webpack: 'running'
};

exports.defaultPort = {
	vite: 3000,
	webpack: 3001,
	snowpack: 8080
};
