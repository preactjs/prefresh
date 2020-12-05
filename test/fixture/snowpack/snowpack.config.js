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
