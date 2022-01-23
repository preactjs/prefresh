import { useEffect, useState } from 'react';

export const Effect = () => {
  const [state, setState] = useState('');

  useEffect(() => { setState('hello world'); }, []);

  return <p id="effect-test">{state}</p>
}
