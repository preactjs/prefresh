import { useCounter } from './useCounter'
import { StoreProvider } from './context';
import { Products } from './products'

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
      <StoreProvider>
        <Products />
      </StoreProvider>
    </div>
  )
}
