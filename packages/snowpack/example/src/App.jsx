import { h } from 'preact';
import { useCounter } from './useCounter';

function App() {
  const [count, increment, decrement] = useCounter()
  return (
    <div style={{ display: 'flex' }}>
      <button onClick={decrement}>-10</button>
      <p>Count: {count}</p>
      <button onClick={increment}>+10</button>
    </div>
  );
}

export default App;
