import { useCounter } from './useCounter'
import { h } from 'preact'
import { Greeting } from './greeting.jsx';
import { StoreProvider } from './context.jsx';
import { Products } from './products.jsx';
import { Effect } from './effect.jsx';
import { Style } from './styles';
import { setup } from 'goober';
import Default from './default.jsx';

setup(h);

function Test() {
  const [count, increment] = useCounter();
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="button" onClick={increment}>Increment</button>
    </div>
  )
}

export const Anchor = 'a';

export function App(props) {
  return (
    <Style id="color">
      <Test />
      <Anchor />
      <Greeting />
      <StoreProvider>
        <Products />
      </StoreProvider>
      <Effect />
      <Default />
    </Style>
  )
}
