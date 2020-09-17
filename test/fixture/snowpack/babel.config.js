module.exports = {
	presets: [
		[
			'@babel/preset-react',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	],
	plugins: [
		'@babel/plugin-syntax-import-meta',
		['@prefresh/babel-plugin', { skipEnvCheck: true }]
	]
};
