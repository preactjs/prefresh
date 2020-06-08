module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		'react-refresh/babel',
		[
			'@babel/plugin-transform-react-jsx',
			{
				pragma: 'h',
				pragmaFrag: 'Fragment'
			}
		]
	]
};
