const path = require('path');

exports.integrations = ['vite', 'snowpack', 'rollup', 'next', 'webpack'];
exports.supportsClassComponents = ['next', 'webpack', 'nollup'];

exports.bin = {
	next: dir => path.resolve(dir, `./node_modules/next/dist/node/next`),
	rollup: dir => path.resolve(dir, `./node_modules/nollup/lib/cli.js`),
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
	next: ['dev -p 3002'],
	snowpack: ['dev'],
	webpack: [],
	vite: [],
	rollup: ['-c', '--hot', '--content-base', 'public', '--port', '3003']
};

exports.goMessage = {
	vite: 'running',
	snowpack: 'Server started',
	webpack: 'successfully',
	rollup: 'Compiled'
	next: 'successfully'
};

exports.defaultPort = {
	vite: 3000,
	webpack: 3001,
	next: 3002,
	rollup: 3003,
	snowpack: 3004
};
