import { h } from 'preact';
import { signal } from '@preact/signals';
import { Input } from './Input.jsx'

const count = signal(0)
function Counter() {
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="increment" onClick={() => { count.value = count.peek() + 1 }}>Increment</button>
    </div>
  )
}

export function App() {
  return (
    <main>
      <Counter />
      <Input />
    </main>
  )
}
