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

exports.injectEntry = injectEntry;
