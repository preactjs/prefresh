const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

module.exports = {
	mount: {
		public: '/',
		src: '/_dist_'
	},
	plugins: [
		'@snowpack/plugin-babel',
		'@prefresh/snowpack',
		'@snowpack/plugin-dotenv'
	],
	devOptions: {
		open: 'none'
	}
};
