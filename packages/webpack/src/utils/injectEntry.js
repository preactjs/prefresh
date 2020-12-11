const injectEntry = originalEntry => {
  const entryInjects = [require.resolve('@prefresh/core')];

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

  if (typeof originalEntry === 'function') {
    return (...args) =>
      Promise.resolve(originalEntry(...args)).then(injectEntry);
  }

  throw new Error("Can't detect valid entry point.");
};

exports.injectEntry = injectEntry;
