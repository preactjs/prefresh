// Options for Preact.
import './runtime/catchError';
import './runtime/debounceRendering';
import './runtime/vnode';
import './runtime/unmount';

import { Component } from 'preact';

import {
  VNODE_COMPONENT,
  NAMESPACE,
  HOOKS_LIST,
  EFFECTS_LIST,
  COMPONENT_HOOKS,
  HOOK_ARGS,
  HOOK_VALUE,
  HOOK_CLEANUP,
} from './constants';
import { computeKey } from './computeKey';
import { vnodesForComponent, mappedVNodes, lastSeen } from './runtime/vnodesForComponent';
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
  const vnodes = vnodesForComponent.get(OldType);
  if (!vnodes) return;

  // migrate the list to our new constructor reference
  vnodesForComponent.delete(OldType);
  vnodesForComponent.set(NewType, vnodes);

  mappedVNodes.set(OldType, NewType);

  pendingUpdates = pendingUpdates.filter(p => p[0] !== OldType);

  vnodes.forEach(node => {
    let vnode = node;
    if (vnode && vnode.__v && !vnode.__c && lastSeen.has(vnode.__v)) {
      vnode = lastSeen.get(vnode.__v);
      lastSeen.delete(vnode.__v);
    }

    // if the vnode
    if (!vnode || !vnode.__c || !vnode.__c.__P) return;
    // update the type in-place to reference the new component
    vnode.type = NewType;

    if (vnode[VNODE_COMPONENT]) {
      vnode[VNODE_COMPONENT].constructor = vnode.type;

      try {
        if (vnode[VNODE_COMPONENT] instanceof OldType) {
          const oldInst = vnode[VNODE_COMPONENT];

          const newInst = new NewType(
            vnode[VNODE_COMPONENT].props,
            vnode[VNODE_COMPONENT].context
          );

          vnode[VNODE_COMPONENT] = newInst;
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
        vnode[VNODE_COMPONENT].constructor = NewType;
      }

      if (resetHookState) {
        if (
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS] &&
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST] &&
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].length
        ) {
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(
            possibleEffect => {
              if (
                possibleEffect[HOOK_CLEANUP] &&
                typeof possibleEffect[HOOK_CLEANUP] === 'function'
              ) {
                possibleEffect[HOOK_CLEANUP]();
                possibleEffect[HOOK_CLEANUP] = undefined;
              } else if (
                possibleEffect[HOOK_ARGS] &&
                possibleEffect[HOOK_VALUE] &&
                Object.keys(possibleEffect).length === 3
              ) {
                const cleanupKey = Object.keys(possibleEffect).find(
                  key => key !== HOOK_ARGS && key !== HOOK_VALUE
                );
                if (
                  cleanupKey &&
                  typeof possibleEffect[cleanupKey] == 'function'
                ) {
                  possibleEffect[cleanupKey]();
                  possibleEffect[cleanupKey] = undefined;
                }
              }
            }
          );
        }

        vnode[VNODE_COMPONENT][COMPONENT_HOOKS] = {
          [HOOKS_LIST]: [],
          [EFFECTS_LIST]: [],
        };
      } else if (
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS] &&
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST] &&
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].length
      ) {
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(
          possibleEffect => {
            if (
              possibleEffect[HOOK_CLEANUP] &&
              typeof possibleEffect[HOOK_CLEANUP] === 'function'
            ) {
              possibleEffect[HOOK_CLEANUP]();
              possibleEffect[HOOK_CLEANUP] = undefined;
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
              possibleEffect[cleanupKey] = undefined;
            }
          }
        );

        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(hook => {
          if (hook.__H && Array.isArray(hook.__H)) {
            hook.__H = undefined;
          }
        });
      }

      Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
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
