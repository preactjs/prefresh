// Options for Preact.
import './runtime/vnode';
import './runtime/diffed';
import './runtime/unmount';

import { Component } from 'preact';
import { VNODE_COMPONENT, NAMESPACE } from './constants';
import { vnodesForComponent } from './runtime/vnodesForComponent';

const signaturesForType = new WeakMap();

const computeKey = signature => {
	let fullKey = signature.key;
	let hooks;

	try {
		hooks = signature.getCustomHooks();
	} catch (err) {
		signature.forceReset = true;
		signature.key = fullKey;
		return;
	}

	for (let i = 0; i < hooks.length; i++) {
		const hook = hooks[i];
		if (typeof hook !== 'function') {
			signature.forceReset = true;
			signature.key = fullKey;
			return;
		}

		const nestedHookSignature = signaturesForType.get(hook);
		if (nestedHookSignature === undefined) continue;

		const nestedHookKey = computeKey(nestedHookSignature);
		if (nestedHookSignature.forceReset) signature.forceReset = true;

		fullKey += '\n---\n' + nestedHookKey;
	}

	signature.key = signature.fullKey = fullKey;
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
			computeKey(signaturesForType.get(type));
		} else {
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

			Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
		}
	});
}

self[NAMESPACE] = {
	getSignature: type => signaturesForType.get(type),
	replaceComponent,
	sign
};
