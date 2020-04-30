const injectEntry = originalEntry => {
  const entryInjects = [require.resolve('./runtime.js'),];

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
        [curKey]: injectEntry(curEntry),
      }),
      {}
    );
  }
};

exports.countStatefulHooks = (hooks) => hooks.reduce((acc, hook) => Array.isArray(hook.__) ? acc + 1 :  acc, 0)
exports.injectEntry = injectEntry;
