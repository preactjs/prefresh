const warnings = new Set();

export const compareSignatures = (prev, next) => {
	const prevSignature = self.__PREFRESH__.getSignature(prev) || {};
	const nextSignature = self.__PREFRESH__.getSignature(next) || {};

	if (
		prevSignature.key !== nextSignature.key ||
		self.__PREFRESH__.computeKey(prevSignature) !==
			self.__PREFRESH__.computeKey(nextSignature) ||
		nextSignature.forceReset
	) {
		self.__PREFRESH__.replaceComponent(prev, next, true);
	} else {
		self.__PREFRESH__.replaceComponent(prev, next, false);
	}
};

export const isPreactCitizen = name =>
	typeof name === 'string' &&
	name[0](
		(name[0] && name[0] == name[0].toUpperCase()) ||
			(name.startsWith('use') && name[3] && name[3] == name[3].toUpperCase())
	);

export const isCustomHook = name =>
	typeof name === 'string' &&
	name.startsWith('use') &&
	name[3] &&
	name[3] == name[3].toUpperCase();

export const isComponent = name =>
	typeof name === 'string' && name[0] && name[0] == name[0].toUpperCase();

export const scanExports = (moduleExports, id) => {
	let hasExportedHook = false;
	let hasExportedComponent = false;

	const exportedHooks = [];
	const exportedComponents = [];

	moduleExports.forEach(exportName => {
		// TODO: warn when a component/hook has no name.
		// For instance: export default () => <p>hi</p>
		if (isComponent(exportName)) {
			exportedComponents.push(exportName);
			hasExportedComponent = true;
		} else if (isCustomHook(exportName)) {
			exportedHooks.push(exportName);
			hasExportedHook = true;
		}
	});

	if (warnings.has(id)) {
		if (!hasExportedComponent || !hasExportedHook) warnings.delete(id);
		return;
	}

	if (hasExportedComponent && hasExportedHook) {
		warnings.add(id);
		console.warn(`
      [Prefresh]

      You are combining hook and component exports in the same module, this could lead to unexpected behavior in prefresh.

      Exported components: ${exportedComponents.join(', ')}.
      Exported hooks: ${exportedHooks.join(', ')}.

      It's advised to move the hooks to a seperate file.
    `);
	}
};
