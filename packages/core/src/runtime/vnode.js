import { options } from 'preact';
import { internalsByType, mappedTypes } from './internalsByType';
import { TYPE_CLASS, VNODE_COMPONENT } from '../constants';

const getMappedInternal = type => {
  if (mappedTypes.has(type)) {
    return getMappedInternal(mappedTypes.get(type));
  }

  return type;
};

const oldInternal = options.__i;
options.__i = internal => {
  if (internal && typeof internal.type === 'function') {
    const internals = internalsByType.get(internal.type);
    if (!internals) {
      internalsByType.set(internal.type, [internal]);
    } else {
      internals.push(internal);
    }

    const foundType = getMappedInternal(internal.type);
    internal.type = foundType;
    if (internal[VNODE_COMPONENT] && internal.flags & TYPE_CLASS) {
      internal[VNODE_COMPONENT].constructor = foundType;
    }
  }

  if (oldInternal) oldInternal(internal);
};
