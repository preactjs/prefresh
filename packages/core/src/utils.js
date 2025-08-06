import { COMPONENT_BITS, COMPONENT_DIRTY, VNODE_COMPONENT } from "./constants"

/** Component is queued for update */
export const COMPONENT_DIRTY_BIT = 1 << 3;

export const isDirty = vnode => {
  if (vnode[VNODE_COMPONENT] && vnode[VNODE_COMPONENT][COMPONENT_DIRTY]) {
    return true;
  }

  if (vnode[VNODE_COMPONENT] && (vnode[VNODE_COMPONENT][COMPONENT_BITS] & COMPONENT_DIRTY_BIT)) {
    return true;
  }
}

export const unsetDirty = vnode => {
  if (vnode[VNODE_COMPONENT]) {
    if (vnode[VNODE_COMPONENT][COMPONENT_DIRTY]) vnode[VNODE_COMPONENT][COMPONENT_DIRTY] = false;
    if (vnode[VNODE_COMPONENT][COMPONENT_BITS]) vnode[VNODE_COMPONENT][COMPONENT_BITS] &= ~COMPONENT_DIRTY_BIT;
  }
}
