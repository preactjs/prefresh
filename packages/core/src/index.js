// Options for Preact.
import './runtime/vnode';
import './runtime/diffed';
import './runtime/unmount';
import './runtime/hook';

import { options, Component } from 'preact';
import {
	VNODE_COMPONENT,
	COMPONENT_HOOKS,
	HOOKS_LIST,
	HOT_RELOAD_ID,
	HOOK_OPTION,
	NAMESPACE
} from './constants';
import { vnodesForComponent } from './runtime/vnodesForComponent';

const signaturesForType = new WeakMap();

const computeKey = signature => {
	let fullKey = signature.key;
	let hooks;
	try {
		hooks = signature.getCustomHooks();
	} catch (err) {
		signature.forceReset = true;
		signature.fullKey = fullKey;
		return;
	}

	for (let i = 0; i < hooks.length; i++) {
		const hook = hooks[i];
		if (typeof hook !== 'function') {
			signature.forceReset = true;
			signature.fullKey = fullKey;
			return;
		}

		const nestedHookSignature = signaturesForType.get(hook);
		if (nestedHookSignature === undefined) continue;

		const nestedHookKey = computeKey(nestedHookSignature);
		if (nestedHookSignature.forceReset) {
			signature.forceReset = true;
		}
		fullKey += '\n---\n' + nestedHookKey;
	}

	signature.fullKey = fullKey;
};

function sign(type, key, forceReset, getCustomHooks) {
	if (type) {
		const signature = signaturesForType.get(type);
		if (!signature) {
			signaturesForType.set(type, {
				type,
				key,
				forceReset,
				getCustomHooks: getCustomHooks || (() => [])
			});
		} else if (!signature.fullKey) {
			computeKey(signature);
		}
	}
}

function replaceComponent(OldType, NewType) {
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

			if (vnode[VNODE_COMPONENT][COMPONENT_HOOKS]) {
				const visited = new WeakSet();
				const hooks = vnode[VNODE_COMPONENT][COMPONENT_HOOKS];
				const oldOptionsHook = options[HOOK_OPTION];

				options[HOOK_OPTION] = (component, index, type) => {
					const hooks = component[COMPONENT_HOOKS][HOOKS_LIST];
					if (hooks[index].type !== type) {
						hooks.splice(index, 0, { type });
					} else if (hooks[index][HOT_RELOAD_ID]) {
						visited.add(hooks[index][HOT_RELOAD_ID]);
					}

					if (oldOptionsHook) oldOptionsHook(component, index, type);
				};

				Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT], () => {
					// We have finished the update, all that's left to do is check whether
					// or not we have unvisited hooks, if we do we can safely remove them since
					// this code could've been removed.
					vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(
						(hook, i) => {
							const hotReloadId = hook[HOT_RELOAD_ID];
							if (hotReloadId && !visited.has(hotReloadId)) {
								hooks.__.splice(i, 1);
							}
						}
					);
					options[HOOK_OPTION] = oldOptionsHook;
				});
			} else {
				Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
			}
		}
	});
}

const getSignature = type => signaturesForType.get(type);

self[NAMESPACE] = { replaceComponent, sign, getSignature };
