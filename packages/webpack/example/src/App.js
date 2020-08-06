import { h } from 'preact';
import { useCounter } from './useCounter';

const Comp1 = () => {
	const [count, increment] = useCounter(0);
	return (
		<div>
			<p>Counter: {count}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
};

export function App(props) {
	return (
		<div>
			<Comp1 />
		</div>
	);
}
