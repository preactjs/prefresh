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
