import { lazy, Suspense, useState, createElement as h, Fragment } from 'preact/compat';

const Test1Lazy = lazy(() => import('./test1.jsx'));
const Test2Lazy = lazy(() => import('./test2.jsx'));

export function App() {
  const [show, setShow] = useState(true);

  const toggle = () => {
    setShow(!show);
  };

  return (
    <>
      <Suspense fallback={<div>Loading</div>}>
        {show ? <Test1Lazy /> : <Test2Lazy />}
      </Suspense>
      <button className='toggle' onClick={toggle}>Toggle</button>
    </>
  );
}
