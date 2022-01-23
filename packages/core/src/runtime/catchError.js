import { options } from 'preact';
import { CATCH_ERROR_OPTION } from '../constants';

const DIRTY_BIT = 1 << 14;

const oldCatchError = options[CATCH_ERROR_OPTION];
options[CATCH_ERROR_OPTION] = (error, internal) => {
  if (internal.flags & DIRTY_BIT) {
    internal.flags |= DIRTY_BIT;
  }

  if (oldCatchError) oldCatchError(error, internal);
};
