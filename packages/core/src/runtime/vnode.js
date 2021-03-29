import { options } from 'preact';
import { vnodesForComponent, mappedVNodes } from './vnodesForComponent';
import { VNODE_COMPONENT } from '../constants';

const getMappedVnode = type => {
  if (mappedVNodes.has(type)) {
    return getMappedVnode(mappedVNodes.get(type));
  }

  return type;
};

const oldVnode = options.vnode;
options.vnode = vnode => {
  if (vnode && typeof vnode.type === 'function') {
    let vnodeType = vnode.type;
    if (
      vnode[VNODE_COMPONENT] &&
      vnode[VNODE_COMPONENT].constructor &&
      vnode[VNODE_COMPONENT].constructor !== vnode.type
    ) {
      vnodeType = vnode[VNODE_COMPONENT].constructor;
    }

    const vnodes = vnodesForComponent.get(vnodeType);
    if (!vnodes) {
      vnodesForComponent.set(vnodeType, [vnode]);
    } else {
      vnodes.push(vnode);
    }

    const foundType = getMappedVnode(vnodeType);
    if (vnode[VNODE_COMPONENT]) {
      vnode[VNODE_COMPONENT].constructor = foundType;
    }
  }

  if (oldVnode) oldVnode(vnode);
};
