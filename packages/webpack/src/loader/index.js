const { Template } = require('webpack');

const moduleRuntime = Template.getFunctionContent(require('./runtime'))
	.trim()
	.replace(/^ {2}/gm, '');

module.exports = function RefreshHotLoader(source, inputSourceMap) {
	this.callback(null, source + '\n\n' + moduleRuntime, inputSourceMap);
};
