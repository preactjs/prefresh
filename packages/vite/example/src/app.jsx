import { Logo } from './logo'
import { useCounter } from './useCounter'

function Test() {
  return <p>Test</p>
}

export function App(props) {
  const [count, increment] = useCounter(0);
  return (
    <div>
      <Logo />
      <p>Count: {count}</p>
      <button onClick={increment}>f</button>
      <Test />
    </div>
  )
}
