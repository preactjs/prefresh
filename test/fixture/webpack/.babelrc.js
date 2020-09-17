module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		['@prefresh/babel', { skipEnvCheck: true }],
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	]
};
