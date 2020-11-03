exports.prefreshUtils = '__prefresh_utils__';
exports.NAME = 'PrefreshWebpackPlugin';

exports.optionsWithoutNodeModules = {
	include: /\.([jt]sx?)$/,
	exclude: /node_modules/
};

exports.optionsWithNodeModules = {
	include: /\.([jt]sx?)$/
};
