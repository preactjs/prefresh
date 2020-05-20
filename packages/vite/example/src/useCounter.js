import { useState } from 'preact/hooks';

export const useCounter = initialValue => {
	const [state, setState] = useState(initialValue || 0);
	return [state, () => setState(state + 1)];
};
