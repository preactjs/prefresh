import { useState } from 'preact/hooks';

export const useCounter = initialValue => {
	const [state, setState] = useState(10);
	return [state, () => setState(state + 2)];
};
