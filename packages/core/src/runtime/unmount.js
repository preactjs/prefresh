import { options } from 'preact';
import { internalsByType } from './internalsByType';

const oldUnmount = options.unmount;
options.unmount = internal => {
  const type = (internal || {}).type;
  if (typeof type === 'function' && internalsByType.has(type)) {
    const internals = internalsByType.get(type);
    if (internals) {
      const index = internals.indexOf(internal);
      if (index !== -1) {
        internals.splice(index, 1);
      }
    }
  }

  if (oldUnmount) oldUnmount(internal);
};
