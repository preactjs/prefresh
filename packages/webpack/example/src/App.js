import { h } from 'preact';
import { useCounter } from './useCounter';

export function App(props) {
	const [count, increment] = useCounter(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
}
