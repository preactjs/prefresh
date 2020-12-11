import { useCounter } from './useCounter'
import { h } from 'preact'
import { StoreProvider } from './context';
import { Products } from './products';
import { Greeting } from './greeting';
import { Effect } from './effect';

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
      <Effect />
    </div>
  )
}
