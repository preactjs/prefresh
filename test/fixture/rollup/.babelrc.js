module.exports = {
	presets: ['babel-preset-preact'],
	plugins: [
		[require.resolve('@prefresh/babel-plugin-prefresh'), { skipEnvCheck: true }]
	]
};
