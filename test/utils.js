export const timeout = n => new Promise(r => setTimeout(r, n));

export const bin = {
	snowpack: dir =>
		path.resolve(dir, `./node_modules/snowpack/dist-node/index.bin.js`),
	vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`)
};

export const binArgs = {
	snowpack: ['dev'],
	vite: []
};

export const goMessage = {
	vite: 'running',
	snowpack: 'Server started'
};

export const defaultPort = {
	vite: 3000,
	snowpack: 8080
};

export const getFixtureDir = integration =>
	path.join(__dirname, '../test/fixture', integration);

export const getTempDir = integration =>
	path.join(__dirname, '../temp', integration);
