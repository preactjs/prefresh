module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		[require.resolve('@prefresh/plugin-prefresh'), { skipEnvCheck: true }],
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	]
};
