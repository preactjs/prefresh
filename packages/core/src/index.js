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
	VNODE_DOM,
	VNODE_CHILDREN
} from './constants';
import { computeKey } from './computeKey';
import { vnodesForComponent } from './runtime/vnodesForComponent';
import { signaturesForType } from './runtime/signaturesForType';

function sign(type, key, forceReset, getCustomHooks, status) {
	if (type) {
		let signature = signaturesForType.get(type);
		if (status === 'begin') {
			signaturesForType.set(type, {
				type,
				key,
				forceReset,
				getCustomHooks: getCustomHooks || (() => [])
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

	vnodes.forEach(vnode => {
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
				vnode[VNODE_COMPONENT][COMPONENT_HOOKS] = {
					[HOOKS_LIST]: [],
					[EFFECTS_LIST]: []
				};
			}

			// Cleanup when an async component has thrown.
			if (
				(vnode[VNODE_DOM] && !document.contains(vnode[VNODE_DOM])) ||
				(!vnode[VNODE_DOM] && !vnode[VNODE_CHILDREN])
			) {
				location.reload();
			}

			Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
		}
	});
}

self[NAMESPACE] = {
	getSignature: type => signaturesForType.get(type),
	register: (type, id) => {
		if (!signaturesForType.has(type)) {
			signaturesForType.set(type, {
				getCustomHooks: () => [],
				type
			});
		}
	},
	replaceComponent,
	sign,
	computeKey
};
