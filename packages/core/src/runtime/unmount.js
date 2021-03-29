import { options } from 'preact';
import { VNODE_COMPONENT } from '../constants';
import { vnodesForComponent } from './vnodesForComponent';

const oldUnmount = options.unmount;
options.unmount = vnode => {
  const type = (vnode || {}).type;
  if (typeof type === 'function' && vnodesForComponent.has(type)) {
    const vnodes = vnodesForComponent.get(type);
    if (vnodes) {
      const index = vnodes.indexOf(vnode);
      if (index !== -1) {
        vnodes.splice(index, 1);
      }
    }

    if (
      vnode[VNODE_COMPONENT] &&
      vnode[VNODE_COMPONENT].constructor &&
      vnode[VNODE_COMPONENT].constructor !== vnode.type
    ) {
      const vnodesForConstructor = vnodesForComponent.get(
        vnode[VNODE_COMPONENT].constructor
      );
      if (vnodesForConstructor) {
        const index = vnodesForConstructor.indexOf(vnode);
        if (index !== -1) {
          vnodesForConstructor.splice(index, 1);
        }
      }
    }
  }

  if (oldUnmount) oldUnmount(vnode);
};
