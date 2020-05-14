import { isComponent, compareSignatures } from '@prefresh/utils';

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

const registerExports = m => {
	let isCitizen = false;
	const moduleId = module.id;
	const moduleExports = getExports(m);

	if (typeof moduleExports === 'function' && isComponent(moduleExports.name)) {
		isCitizen = true;
		window.__PREFRESH__.register(moduleExports, moduleId + ' %exports%');
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
			if (typeof exportValue === 'function' && isComponent(exportValue.name)) {
				isCitizen = isCitizen || true;
				const typeID = moduleId + ' %exports% ' + key;
				window.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}

	return isCitizen;
};

export function __$RefreshCheck$__(module) {
	const isCitizen = registerExports(module);

	if (module.hot && isCitizen) {
		const moduleExports = getExports(module);
		const m =
			module.hot.data && module.hot.data.module && module.hot.data.module;

		if (m) {
			for (let i in moduleExports) {
				const fn = moduleExports[i];
				try {
					if (typeof fn === 'function') {
						const oldExports = getExports(m);
						if (i in oldExports) {
							compareSignatures(oldExports[i], fn);
						}
					}
				} catch (e) {
					self.location.reload();
				}
			}
		}

		module.hot.dispose(function(data) {
			data.module = module;
		});

		module.hot.accept(function() {
			require(module.id);
		});
	}
}
