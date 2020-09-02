module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		['react-refresh/babel', { skipEnvCheck: true }],
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	]
};
