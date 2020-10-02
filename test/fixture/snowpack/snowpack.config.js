const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

module.exports = {
	mount: {
		public: '/',
		src: '/_dist_'
	},
	plugins: ['@prefresh/snowpack'],
	devOptions: {
		open: 'none',
		port: 3004
	}
};
