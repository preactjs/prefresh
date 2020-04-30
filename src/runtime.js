import { options, Component } from 'preact';
import { countStatefulHooks } from './utils';

const defaultHookState = {
  __: [], // _list
  __h: [] // _pendingEffects
}

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
    const component = vnode.__c;
    if (component) {
       const hooks = component.__H;
       if (component.__H) {
         component.__H = defaultHookState
       }
      Component.prototype.forceUpdate.call(c);
    }
  });
}

window.__PREACT__ = { replaceComponent }

const oldVnode = options.vnode;
options.vnode = vnode => {
  if (typeof (vnode || {}).type === 'function') {
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
    vnodesForComponent.delete(type)
  }
  if (oldUnmount) oldUnmount(oldVNode, newVNode);
}

// IDEA
// if (hooks && hooks.__) {
//   const count = countStatefulHooks(hooks.__);
//   Component.prototype.forceUpdate.call(c);
//   const newCount = countStatefulHooks(hooks.__);
//   if (count !== newCount) {
//     // We'll have to reset hookState and call forceUpdate again.
//     // There's another case where we add a dependency to a hook but
//     // I'm not sure if we need to cover this.
//   }
// } else {
//   // TODO: this is a class-component potentially and we should check
//   // if any of the lifecycle methods have been altered.
//   Component.prototype.forceUpdate.call(c);
// }
