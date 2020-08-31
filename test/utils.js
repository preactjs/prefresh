const path = require('path');

exports.timeout = n => new Promise(r => setTimeout(r, n));

exports.bin = {
	snowpack: dir =>
		path.resolve(dir, `./node_modules/snowpack/dist-node/index.bin.js`),
	vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`)
};

exports.binArgs = {
	snowpack: ['dev'],
	vite: []
};

exports.goMessage = {
	vite: 'running',
	snowpack: 'Server started'
};

exports.defaultPort = {
	vite: 3000,
	snowpack: 8080
};

exports.getFixtureDir = integration =>
	path.join(__dirname, '../test/fixture', integration);

exports.getTempDir = integration =>
	path.join(__dirname, '../temp', integration);
