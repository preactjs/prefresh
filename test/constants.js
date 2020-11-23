const path = require('path');

exports.integrations = [
	'vite',
	'snowpack',
	'nollup',
	'next',
	'webpack',
	'web-dev-server'
];
exports.supportsClassComponents = [
	'vite',
	'snowpack',
	'nollup',
	'next',
	'webpack',
	'web-dev-server'
];

exports.bin = {
	next: dir => path.resolve(dir, `./node_modules/next/dist/bin/next`),
	nollup: dir => path.resolve(dir, `./node_modules/nollup/lib/cli.js`),
	snowpack: dir =>
		path.resolve(dir, `./node_modules/snowpack/dist-node/index.bin.js`),
	vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
	'web-dev-server': dir =>
		path.resolve(dir, `./node_modules/@web/dev-server/dist/bin.js`),
	webpack: dir =>
		path.resolve(
			dir,
			`./node_modules/webpack-dev-server/bin/webpack-dev-server.js`
		)
};

exports.binArgs = {
	next: ['dev', '-p', '3002'],
	snowpack: ['dev'],
	webpack: [],
	vite: [],
	nollup: ['-c', '--hot', '--content-base', 'public', '--port', '3003'],
	'web-dev-server': []
};

exports.goMessage = {
	vite: 'running',
	snowpack: 'Server started',
	webpack: 'successfully',
	nollup: 'Compiled',
	next: 'successfully',
	'web-dev-server': 'started'
};

exports.defaultPort = {
	vite: 3000,
	webpack: 3001,
	next: 3002,
	nollup: 3003,
	snowpack: 3004,
	'web-dev-server': 3005
};
