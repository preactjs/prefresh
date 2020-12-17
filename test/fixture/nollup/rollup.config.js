import node_resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import prefresh from '@prefresh/nollup';

let config = {
	input: './src/index.jsx',
	output: {
		dir: 'dist',
		format: 'esm',
		entryFileNames: '[name].[hash].js',
		assetFileNames: '[name].[hash][extname]'
	},
	plugins: [
		babel({
			babelHelpers: 'bundled'
		}),
		node_resolve(),
		prefresh()
	]
};

export default config;
