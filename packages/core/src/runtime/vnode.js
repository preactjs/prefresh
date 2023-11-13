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
      vnodesForComponent.set(vnode.type, [vnode]);
    } else {
      vnodes.push(vnode);
    }

    const foundType = getMappedVnode(vnode.type);
    if (foundType !== vnode.type) {
      const vnodes = vnodesForComponent.get(foundType);
      if (!vnodes) {
        vnodesForComponent.set(foundType, [vnode]);
      } else {
        vnodes.push(vnode);
      }
    }

    vnode.type = foundType;
    if (
      vnode[VNODE_COMPONENT] &&
      'prototype' in vnode.type &&
      vnode.type.prototype.render
    ) {
      vnode[VNODE_COMPONENT].constructor = vnode.type;
    }
  }

  if (oldVnode) oldVnode(vnode);
};

const oldDiffed = options.diffed;
options.diffed = vnode => {
  if (vnode && typeof vnode.type === 'function') {
    const vnodes = vnodesForComponent.get(vnode.type);
    if (vnodes) {
      const matchingDom = vnodes.filter(p => p.__c === vnode.__c);
      if (matchingDom.length > 1) {
        const i = vnodes.findIndex(p => p === matchingDom[0]);
        vnodes.splice(i, 1);
      }
    }
  }

  if (oldDiffed) oldDiffed(vnode);
};
