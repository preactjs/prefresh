import { useState } from 'preact/hooks';

export const useCounter = () => {
  const [count, setCount] = useState(0);
  return [count, () => setCount(count + 20), () => setCount(count - 20)];
};