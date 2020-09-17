module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		['@prefresh/babel-plugin', { skipEnvCheck: true }],
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	]
};
