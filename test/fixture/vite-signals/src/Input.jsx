import { h } from 'preact';
import { signal } from '@preact/signals';

const inputValue = signal('foo')
export function Input() {
  return (
    <input className='input' value={inputValue} onInput={e => { inputValue.value = e.currentTarget.value }} />
  )
}
