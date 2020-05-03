const injectEntry = originalEntry => {
	const entryInjects = [require.resolve('./runtime.js')];

	if (typeof originalEntry === 'string') {
		return [...entryInjects, originalEntry];
	}

	if (Array.isArray(originalEntry)) {
		return [...entryInjects, ...originalEntry];
	}

	if (typeof originalEntry === 'object') {
		return Object.entries(originalEntry).reduce(
			(acc, [curKey, curEntry]) => ({
				...acc,
				[curKey]: injectEntry(curEntry)
			}),
			{}
		);
	}
};

exports.countStatefulHooks = hooks =>
	hooks.reduce((acc, hook) => (Array.isArray(hook.__) ? acc + 1 : acc), 0);
exports.injectEntry = injectEntry;

const isMemoHook = hook => !!hook.__h;

exports.isStateFulHook = hook => Array.isArray(hook.__); // HookState._value is an array of value and dispatch
exports.isEffectHook = hook => typeof hook.__ === 'function'; // HookState._value is a function (will also be useImperativeHandle)
exports.isRefHook = hook =>
	isMemoHook(hook) && typeof hook.__ === 'object' && hook.__.current;
exports.isMemoHook = isMemoHook;
exports.isContextHook = hook => !!hook.__c;
