import { useCounter } from './useCounter'
import { h } from 'preact'
import { Greeting } from './greeting.jsx';
import { StoreProvider } from './context.jsx';
import { Products } from './products.jsx';

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
