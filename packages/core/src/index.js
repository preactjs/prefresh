// Options for Preact.
import './runtime/vnode';
import './runtime/diff';
import './runtime/unmount';

import { Component } from 'preact';
import {
	VNODE_COMPONENT,
	NAMESPACE,
	HOOKS_LIST,
	EFFECTS_LIST,
	COMPONENT_HOOKS
} from './constants';
import { vnodesForComponent } from './runtime/vnodesForComponent';

const signaturesForType = new WeakMap();
const typesForHook = new WeakMap();
const allFamiliesByType = new WeakMap();
const allFamiliesById = new Map();
let pendingUpdates = [];

/**
 *
 * This part has been vendored from "react-refresh"
 * https://github.com/facebook/react/blob/master/packages/react-refresh/src/ReactFreshRuntime.js#L83
 */
const computeKey = signature => {
	let fullKey = signature.key;
	let hooks;

	try {
		hooks = signature.getCustomHooks();
	} catch (err) {
		signature.forceReset = true;
		return fullKey;
	}

	for (let i = 0; i < hooks.length; i++) {
		const hook = hooks[i];
		if (typeof hook !== 'function') {
			signature.forceReset = true;
			return fullKey;
		}

		const nestedHookSignature = signaturesForType.get(hook);
		if (nestedHookSignature === undefined) continue;

		const nestedHookKey = computeKey(nestedHookSignature);
		if (nestedHookSignature.forceReset) signature.forceReset = true;

		fullKey += '\n---\n' + nestedHookKey;

		const types = typesForHook.get(hook);
		if (types && types.length) {
			if (types.indexOf(signature.type) === -1) {
				typesForHook.set(hook, [...types, signature.type]);
			}
		} else {
			typesForHook.set(hook, [signature.type]);
		}
	}

	return fullKey;
};

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
			}

			if (resetHookState) {
				vnode[VNODE_COMPONENT][COMPONENT_HOOKS] = {
					[HOOKS_LIST]: [],
					[EFFECTS_LIST]: []
				};
			}

			Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
		}
	});
	pendingUpdates = [];
}

function replaceHook(prev, next, resetHookState) {
	const types = typesForHook.get(prev);
	if (!types) return;

	// migrate the list to our new constructor reference
	typesForHook.delete(prev);
	typesForHook.set(next, types);

	types.forEach(type => {
		const vnodes = vnodesForComponent.get(type);
		if (!vnodes) return;

		const newType = (pendingUpdates.find(
			update => update[0].current === type
		) || [null, type])[1];

		vnodes.forEach(vnode => {
			vnode.type = newType;
			vnode[VNODE_COMPONENT].constructor = newType;
			if (resetHookState) {
				vnode[VNODE_COMPONENT][COMPONENT_HOOKS] = {
					[HOOKS_LIST]: [],
					[EFFECTS_LIST]: []
				};
			}

			Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
		});
	});

	pendingUpdates = [];
}

function register(type, id) {
	if (!type || typeof type !== 'function') return;

	if (allFamiliesByType.has(type)) return;

	let family = allFamiliesById.get(id);
	if (!family) {
		family = { current: type };
		allFamiliesById.set(id, family);
	} else {
		pendingUpdates.push([family, type]);
	}

	allFamiliesByType.set(type, family);
}

self[NAMESPACE] = {
	getSignature: type => signaturesForType.get(type),
	register,
	replaceComponent,
	replaceHook,
	sign
};
