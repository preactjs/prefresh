import { h } from 'preact';
import { Logo } from './logo';
import { useCounter } from './useCounter';

function Test() {
  const [count, increment] = useCounter(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export function App(props) {
  return (
    <div>
      <Logo />
      <Test />
    </div>
  );
}
