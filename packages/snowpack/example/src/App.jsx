import { h } from 'preact';
import { lazy, Suspense } from 'preact/compat';

const Lazy = lazy(function () {
  return import('./lazy');
});

function App() {
  return (
    <Suspense fallback={<div style={{ display: 'flex' }}>Loading</div>}>
      <div style={{ display: 'flex' }}>
        <Lazy />
      </div>
    </Suspense>
  );
}

export default App;
