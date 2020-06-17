const { isComponent, compareSignatures } = require('@prefresh/utils');

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

const registerExports = m => {
	let isCitizen = false;
	const moduleId = module.id;
	const moduleExports = getExports(m);

	if (
		typeof moduleExports === 'function' &&
		isComponent(moduleExports.displayName || moduleExports.name)
	) {
		isCitizen = true;
		self.__PREFRESH__.register(moduleExports, moduleId + ' %exports%');
	}

	if (
		moduleExports === undefined ||
		moduleExports === null ||
		typeof moduleExports !== 'object'
	) {
		isCitizen = isCitizen || false;
	} else {
		for (const key in moduleExports) {
			if (key === '__esModule') continue;

			const exportValue = moduleExports[key];
			if (
				typeof exportValue === 'function' &&
				isComponent(exportValue.displayName || exportValue.name)
			) {
				isCitizen = isCitizen || true;
				const typeID = moduleId + ' %exports% ' + key;
				self.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}

	return isCitizen;
};

module.exports = Object.freeze({
	compareSignatures,
	getExports,
	registerExports
});
