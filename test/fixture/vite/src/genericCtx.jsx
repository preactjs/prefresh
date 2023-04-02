import { h } from 'preact';
import { createContextWithoutDefault } from './helpers';

const [ContextA, useContextA] =
  createContextWithoutDefault('Context A Error');
const [ContextB, useContextB] =
  createContextWithoutDefault('Context B Error');

export function GenericContext() {
  return (
    <ContextA.Provider value={'Context A'}>
      <Test />
    </ContextA.Provider>
  );
}

const Test = () => {
  let contextB;
  try {
    // Expect this to throw.
    contextB = useContextB();
  } catch (e) {
    return <h2 id='ctx-b-error'>Correct behavior: {e.message}</h2>;
  }

  // Instead it has the value of "Context A"!
  return <h2 id='ctx-b-success'>{contextB}</h2>;
};
