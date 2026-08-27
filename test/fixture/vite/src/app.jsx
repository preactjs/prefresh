import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useCounter } from './useCounter';
import { StoreProvider } from './context';
import { Products } from './products';
import { Greeting } from './greeting';
import { Effect } from './effect';
import { GenericContext } from './genericCtx';
import { setup } from 'goober';
import { Style } from './styles';

setup(h);

const lastSeenPayloads = [];
self.__lastSeenPayloads = lastSeenPayloads;

function Test() {
  const [count, increment] = useCounter();
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="button" onClick={increment}>Increment</button>
    </div>
  )
}

function LastSeenChild({ payload }) {
  return <span className="last-seen-child">{payload.count}</span>;
}

function LastSeenTest() {
  const [count, setCount] = useState(0);
  const payload = { count };
  lastSeenPayloads.push(new WeakRef(payload));

  return (
    <div>
      <button className="last-seen-increment" onClick={() => setCount(count + 1)}>
        Increment tracked component
      </button>
      <LastSeenChild payload={payload} />
    </div>
  );
}

export function App(props) {
  return (
    <Style id="color">
      <Test />
      <LastSeenTest />
      <Greeting />
      <StoreProvider>
        <Products />
      </StoreProvider>
      <Effect />
      <GenericContext />
    </Style>
  )
}
