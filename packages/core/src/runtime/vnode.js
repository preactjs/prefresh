import { options } from 'preact';
import {
  vnodesForComponent,
  mappedVNodes,
  lastSeen,
} from './vnodesForComponent';
import { VNODE_COMPONENT } from '../constants';

const getMappedVnode = type => {
  if (mappedVNodes.has(type)) {
    return getMappedVnode(mappedVNodes.get(type));
  }

  return type;
};

const BUILT_IN_COMPONENTS = ['Fragment', 'Suspense', 'SuspenseList'];

const isBuiltIn = type => {
  return BUILT_IN_COMPONENTS.includes(type.name);
};

const oldVnode = options.vnode;
options.vnode = vnode => {
  if (vnode && typeof vnode.type === 'function' && !isBuiltIn(vnode.type)) {
    const foundType = getMappedVnode(vnode.type);
    if (foundType !== vnode.type) {
      vnode.type = foundType;
      if (
        vnode[VNODE_COMPONENT] &&
        'prototype' in vnode.type &&
        vnode.type.prototype.render
      ) {
        vnode[VNODE_COMPONENT].constructor = vnode.type;
      }
    }
  }

  if (oldVnode) oldVnode(vnode);
};

const oldDiff = options.__b;
options.__b = vnode => {
  if (vnode && typeof vnode.type === 'function' && !isBuiltIn(vnode.type)) {
    const vnodes = vnodesForComponent.get(vnode.type);
    if (!vnodes) {
      vnodesForComponent.set(vnode.type, [vnode]);
    } else {
      vnodes.push(vnode);
    }
  }

  if (oldDiff) oldDiff(vnode);
};

const oldDiffed = options.diffed;
options.diffed = vnode => {
  if (vnode && typeof vnode.type === 'function') {
    const vnodes = vnodesForComponent.get(vnode.type);
    lastSeen.set(vnode.__v, vnode);
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
