import { h } from 'preact';
import { signal } from '@preact/signals';

const inputValue = signal(0)
export function Input() {
  return (
    <input className='input' value={inputValue} onInput={e => { inputValue.value = e.currentTarget.value }} />
  )
}
