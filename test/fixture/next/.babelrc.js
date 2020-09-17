module.exports = {
	presets: ['next/babel'],
	plugins: [[require.resolve('@prefresh/plugin-babel'), { skipEnvCheck: true }]]
};
