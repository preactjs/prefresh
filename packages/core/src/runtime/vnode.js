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
    const vnodes = vnodesForComponent.get(vnode.type);
    if (!vnodes) {
      vnodesForComponent.set(vnodeType, [vnode]);
    } else {
      vnodes.push(vnode);
    }

    const foundType = getMappedVnode(vnodeType);
    vnode.type = foundType;
    if (vnode[VNODE_COMPONENT]) {
      vnode[VNODE_COMPONENT].constructor = foundType;
    }
  }

  if (oldVnode) oldVnode(vnode);
};
