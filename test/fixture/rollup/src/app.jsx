import { h } from 'preact';
import { useCounter } from './useCounter'
import { Greeting } from './greeting.jsx';
import { StoreProvider } from './context';
import { Products } from './products';

function Test() {
  const [count, increment] = useCounter();
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="button" onClick={increment}>Increment</button>
    </div>
  )
}

export function App(props) {
  return (
    <div>
      <Test />
      <Greeting />
      <StoreProvider>
        <Products />
      </StoreProvider>
    </div>
  )
}
