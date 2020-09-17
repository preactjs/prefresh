module.exports = {
	presets: ['babel-preset-preact'],
	plugins: [[require.resolve('@prefresh/plugin-babel'), { skipEnvCheck: true }]]
};
