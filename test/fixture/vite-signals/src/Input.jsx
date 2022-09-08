import { h } from 'preact';
import { signal } from '@preact/signals';

const inputValue = signal('foo')
export function Input() {
  return (
    // TODO: after merging https://github.com/preactjs/signals/pull/76 make this value={signal}
    <input className='input' value={inputValue} onInput={e => { inputValue.value = e.currentTarget.value }} />
  )
}
