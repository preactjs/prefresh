// Options for Preact.
import './runtime/catchError';
import './runtime/debounceRendering';
import './runtime/vnode';
import './runtime/unmount';

import {
  DATA_HOOKS,
  VNODE_COMPONENT,
  NAMESPACE,
  HOOKS_LIST,
  EFFECTS_LIST,
  HOOK_ARGS,
  HOOK_VALUE,
  HOOK_CLEANUP,
  TYPE_CLASS,
} from './constants';
import { computeKey } from './computeKey';
import { internalsByType, mappedTypes } from './runtime/internalsByType';
import { signaturesForType } from './runtime/signaturesForType';

let typesById = new Map();
let pendingUpdates = [];

function sign(type, key, forceReset, getCustomHooks, status) {
  if (type) {
    let signature = signaturesForType.get(type);
    if (status === 'begin') {
      signaturesForType.set(type, {
        type,
        key,
        forceReset,
        getCustomHooks: getCustomHooks || (() => []),
      });

      return 'needsHooks';
    } else if (status === 'needsHooks') {
      signature.fullKey = computeKey(signature);
    }
  }
}

function replaceComponent(OldType, NewType, resetHookState) {
  const internals = internalsByType.get(OldType);
  if (!internals) return;

  // migrate the list to our new constructor reference
  internalsByType.delete(OldType);
  internalsByType.set(NewType, internals);

  mappedTypes.set(OldType, NewType);

  pendingUpdates = pendingUpdates.filter(p => p[0] !== OldType);

  internals.forEach(internal => {
    internal.type = NewType;

    if (internal[VNODE_COMPONENT] && internal.flags & TYPE_CLASS) {
      internal[VNODE_COMPONENT].constructor = internal.type;

      try {
        if (internal[VNODE_COMPONENT] instanceof OldType) {
          const oldInst = internal[VNODE_COMPONENT];

          const newInst = new NewType(internal.props, internal.c);

          internal[VNODE_COMPONENT] = newInst;
          // copy old properties onto the new instance.
          //   - Objects (including refs) in the new instance are updated with their old values
          //   - Missing or null properties are restored to their old values
          //   - Updated Functions are not reverted
          //   - Scalars are copied
          for (let i in oldInst) {
            const type = typeof oldInst[i];
            if (!(i in newInst)) {
              newInst[i] = oldInst[i];
            } else if (type !== 'function' && typeof newInst[i] === type) {
              if (
                type === 'object' &&
                newInst[i] != null &&
                newInst[i].constructor === oldInst[i].constructor
              ) {
                Object.assign(newInst[i], oldInst[i]);
              } else {
                newInst[i] = oldInst[i];
              }
            }
          }
        }
      } catch (e) {
        /* Functional component */
      }

      if (resetHookState) {
        if (
          internal.data[DATA_HOOKS] &&
          internal.data[DATA_HOOKS][HOOKS_LIST] &&
          internal.data[DATA_HOOKS][HOOKS_LIST].length
        ) {
          internal.data[DATA_HOOKS][HOOKS_LIST].forEach(possibleEffect => {
            if (
              possibleEffect[HOOK_CLEANUP] &&
              typeof possibleEffect[HOOK_CLEANUP] === 'function'
            ) {
              possibleEffect[HOOK_CLEANUP]();
            } else if (
              possibleEffect[HOOK_ARGS] &&
              possibleEffect[HOOK_VALUE] &&
              Object.keys(possibleEffect).length === 3
            ) {
              const cleanupKey = Object.keys(possibleEffect).find(
                key => key !== HOOK_ARGS && key !== HOOK_VALUE
              );
              if (cleanupKey && typeof possibleEffect[cleanupKey] == 'function')
                possibleEffect[cleanupKey]();
            }
          });
        }

        internal.data[DATA_HOOKS] = {
          [HOOKS_LIST]: [],
          [EFFECTS_LIST]: [],
        };
      } else if (
        internal.data[DATA_HOOKS] &&
        internal.data[DATA_HOOKS][HOOKS_LIST] &&
        internal.data[DATA_HOOKS][HOOKS_LIST].length
      ) {
        // Run possible cleanups
        internal.data[DATA_HOOKS][HOOKS_LIST].forEach(possibleEffect => {
          if (
            possibleEffect[HOOK_CLEANUP] &&
            typeof possibleEffect[HOOK_CLEANUP] === 'function'
          ) {
            possibleEffect[HOOK_CLEANUP]();
          }
        });

        // Reset the args on hooks so they will run again during the next render
        internal.data[DATA_HOOKS][HOOKS_LIST].forEach(hook => {
          if (hook[HOOK_ARGS] && Array.isArray(hook[HOOK_ARGS])) {
            hook[HOOK_ARGS] = undefined;
          }
        });
      }

      // TODO: Cleanup when an async component has thrown.
      // add tests for this because it does not seem to behave the way
      // it is intended to
      // https://github.com/preactjs/prefresh/issues/404
      // if (
      //   (internal[VNODE_DOM] && !document.contains(internal[VNODE_DOM])) ||
      //   (!internal[VNODE_DOM] && !internal[VNODE_CHILDREN])
      // ) {
      //   location.reload();
      // }

      internal.rerender(internal);
    }
  });
}

self[NAMESPACE] = {
  getSignature: type => signaturesForType.get(type),
  register: (type, id) => {
    if (typeof type !== 'function') return;

    if (typesById.has(id)) {
      const existing = typesById.get(id);
      if (existing !== type) {
        pendingUpdates.push([existing, type]);
        typesById.set(id, type);
      }
    } else {
      typesById.set(id, type);
    }

    if (!signaturesForType.has(type)) {
      signaturesForType.set(type, {
        getCustomHooks: () => [],
        type,
      });
    }
  },
  getPendingUpdates: () => pendingUpdates,
  flush: () => {
    pendingUpdates = [];
  },
  replaceComponent,
  sign,
  computeKey,
};
