import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export const Effect = () => {
  const [state, setState] = useState('');

  useEffect(() => { setState('hello world'); }, []);

  return <p id="effect-test">{state}</p>
}
