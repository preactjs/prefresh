import { useState } from 'react';

export const useCounter = () => {
	const [state, setState] = useState(0);
	return [state, () => setState(state + 1)];
};
