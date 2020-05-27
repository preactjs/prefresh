import { options } from 'preact';

import { RERENDER_COUNT } from '../constants';

const defer =
	typeof Promise == 'function'
		? Promise.prototype.then.bind(Promise.resolve())
		: setTimeout;

options.debounceRendering = process => {
	defer(() => {
		try {
			process();
		} catch (e) {
			console.log('has count', process[RERENDER_COUNT]);
			process[RERENDER_COUNT] = 0;
			throw e;
		}
	});
};
