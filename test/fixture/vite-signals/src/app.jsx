import { h } from 'preact';
import { signal, useSignal, useComputed } from '@preact/signals';
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

function HookedCounter() {
  const hookCount = useSignal(1)
  const double = useComputed(() => hookCount.value * 2)
  return (
    <div>
      <p className="signalValue">signalcount: {hookCount}</p>
      <p className="computedValue">DoubleCount: {double}</p>
      <button className="incrementHook" onClick={() => { hookCount.value = hookCount.peek() + 1 }}>Increment</button>
    </div>
  )
}

export function App() {
  return (
    <main>
      <Counter />
      <HookedCounter />
      <Input />
    </main>
  )
}
