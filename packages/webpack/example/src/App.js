import { h } from 'preact';
import { useCounter } from './useCounter';

const Comp1 = () => {
  const [count, increment] = useCounter();
  return (
    <div>
      <p>Count: {count}</p>
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
