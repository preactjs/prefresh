import { h } from 'preact';
import { signal } from '@preact/signals';

const count = signal(0)
export function App() {
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="increment" onClick={() => { count.value = count.peek() + 1 }}>Increment</button>
    </div>
  )
}
