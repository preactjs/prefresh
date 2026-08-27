// all vnodes referencing a given constructor
export const vnodesForComponent = new WeakMap();
export const mappedVNodes = new WeakMap();
export const lastSeen = new Map();

const lastSeenByInstance = new WeakMap();

export const setLastSeen = vnode => {
  const component = vnode.__c;
  if (component) {
    if (lastSeenByInstance.has(component)) {
      lastSeen.delete(lastSeenByInstance.get(component));
    }
    lastSeenByInstance.set(component, vnode.__v);
  }

  lastSeen.set(vnode.__v, vnode);
};

export const clearLastSeen = vnode => {
  lastSeen.delete(vnode.__v);

  const component = vnode.__c;
  if (component && lastSeenByInstance.has(component)) {
    lastSeen.delete(lastSeenByInstance.get(component));
    lastSeenByInstance.delete(component);
  }
};
