import { useEffect, useState } from 'preact/hooks';

export const Effect = () => {
  const [state, setState] = useState('hello world');

  useEffect(() => { setState('hello world'); }, []);

  return <p id="effect-test">{state}</p>
}
