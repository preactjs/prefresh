import { isComponent, flush } from '@prefresh/utils';

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

const shouldBind = m => {
	let isCitizen = false;
	const moduleExports = getExports(m);

	if (
		typeof moduleExports === 'function' &&
		isComponent(moduleExports.displayName || moduleExports.name)
	) {
		isCitizen = true;
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
			}
		}
	}

	return isCitizen;
};

export function __$RefreshCheck$__(module) {
	const isCitizen = shouldBind(module);

	if (module.hot && isCitizen) {
		const m =
			module.hot.data && module.hot.data.module && module.hot.data.module;

		if (m) {
			try {
				flush();
			} catch (e) {
				self.location.reload();
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
