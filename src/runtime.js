import { options, Component } from 'preact';

// all vnodes referencing a given constructor
const vnodesForComponent = new WeakMap();

function replaceComponent(oldType, newType) {
  const vnodes = vnodesForComponent.get(oldType);
  if (!vnodes) return;

  // migrate the list to our new constructor reference
  vnodesForComponent.delete(oldType);
  vnodesForComponent.set(newType, vnodes);

  vnodes.forEach(vnode => {
    // update the type in-place to reference the new component
    vnode.type = newType;
    // enqueue a render
    const c = vnode.__c || vnode._component;
    if (vnode.__c) {
      vnode.__c.constructor = vnode.type;
      if (vnode.__c.__H) {
        // Reset hooks state
        vnode.__c.__H = {
          __: [], // _list
          __h: [] // _pendingEffects
        };
      }

      if (vnode.__c._constructor) {
        Object.setPrototypeOf(vnode.__c, Object.create(newType.prototype));
        for (const key in vnode.__c) {
          if (typeof vnode.__c[key] === 'function' && Object.prototype.hasOwnProperty.call(vnode.__c, key) && !key.includes('constructor')) {
            vnode.__c[key] = newType.prototype[key];
          }
        }
        newType.prototype._constructor.call(vnode.__c);
      }

      Component.prototype.forceUpdate.call(vnode.__c);
    }
  });
}

window.__PREACT__ = { replaceComponent }

const oldVnode = options.vnode;
options.vnode = vnode => {
  if (typeof vnode.type === 'function') {
    const vnodes = vnodesForComponent.get(vnode.type);
    if (!vnodes) {
      vnodesForComponent.set(vnode.type, [vnode]);
    } else {
      vnodes.push(vnode);
    }
  }

  if (oldVnode) oldVnode(vnode);
};

const oldDiffed = options.__b;
options.__b = (oldVNode, newVNode) => {
  const type = (newVNode || {}).type;
  if (typeof type === 'function' && vnodesForComponent.has(type)) {
    const vnodes = vnodesForComponent.get(type);
    const index = vnodes.indexOf(oldVNode);
    if (index !== -1) {
      vnodes.splice(index, 1);
    }
  }
  if (oldDiffed) oldDiffed(oldVNode, newVNode);
}

const oldUnmount = options.unmount;
options.unmount = (vnode) => {
  const type = (vnode || {}).type;
  if (typeof type === 'function' && vnodesForComponent.has(type)) {
    const vnodes = vnodesForComponent.get(type);
    const index = vnodes.indexOf(vnode);
    if (index !== -1) {
      vnodes.splice(index, 1);
    }
  }
  if (oldUnmount) oldUnmount(vnode);
}
