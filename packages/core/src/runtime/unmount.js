import { options } from 'preact';
import { vnodesForComponent } from './vnodesForComponent';

const oldUnmount = options.unmount;
options.unmount = vnode => {
  const type = (vnode || {}).type;
  if (typeof type === 'function' && vnodesForComponent.has(type)) {
    const vnodes = vnodesForComponent.get(type);
    if (vnodes) {
      const mountedVnodesForType = vnodes.filter(
        p => p.__c && p.__c !== vnode.__c
      );
      vnodesForComponent.set(vnode.type, mountedVnodesForType);
    }
  }

  if (oldUnmount) oldUnmount(vnode);
};
