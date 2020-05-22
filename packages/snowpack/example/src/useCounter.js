import { useState } from 'preact/hooks';

export const useCounter = () => {
  const [count, setCount] = useState(0);
  return [count, () => setCount(count + 10), () => setCount(count - 10)];
};
