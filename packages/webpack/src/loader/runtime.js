module.exports = function() {
	const isPreactCitizen = name =>
		typeof name === 'string' &&
		name[0] &&
		(name[0] == name[0].toUpperCase() ||
			(name.startsWith('use') && name[3] == name[3].toUpperCase()));

	// eslint-disable-next-line
	const moduleExports = module.exports || module.__proto__.exports;
	const moduleId = module.id;

	if (
		typeof moduleExports === 'function' &&
		isPreactCitizen(moduleExports.name)
	) {
		window.__PREFRESH__.register(moduleExports, moduleId + ' %exports%');
	}

	if (
		moduleExports === undefined ||
		moduleExports === null ||
		typeof moduleExports !== 'object'
	) {
		// return;
	} else {
		for (const key in moduleExports) {
			if (key === '__esModule') continue;

			const exportValue = moduleExports[key];
			if (
				typeof exportValue === 'function' &&
				isPreactCitizen(exportValue.name)
			) {
				const typeID = moduleId + ' %exports% ' + key;
				window.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}
};
