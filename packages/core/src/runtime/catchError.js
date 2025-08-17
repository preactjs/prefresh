import { options } from 'preact';
import {
  CATCH_ERROR_OPTION,
} from '../constants';
import { isDirty, unsetDirty } from '../utils';

const oldCatchError = options[CATCH_ERROR_OPTION];
options[CATCH_ERROR_OPTION] = (error, vnode, oldVNode, info) => {
  if (isDirty(vnode)) {
    unsetDirty(vnode);
  }

  if (oldCatchError) oldCatchError(error, vnode, oldVNode, info);
};
