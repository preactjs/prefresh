const { compareSignatures } = require('./compareSignatures');
const {
	isPreactCitizen,
	isComponent,
	isCustomHook
} = require('./isPreactCitizen');

module.exports = {
	compareSignatures,
	isPreactCitizen,
	isComponent,
	isCustomHook
};
