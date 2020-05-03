import { options, Component } from 'preact';
import {
	VNODE_COMPONENT,
	COMPONENT_HOOKS,
	HOOKS_LIST,
	HOT_RELOAD_ID,
	HOOK_OPTION,
	NAMESPACE,
	EFFECTS_LIST,
	DIFFED_OPTION
} from '../constants';

// all vnodes referencing a given constructor
const vnodesForComponent = new WeakMap();

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

window[NAMESPACE] = { replaceComponent };

const oldVnode = options.vnode;
options.vnode = vnode => {
	if (typeof vnode.type === 'function') {
		const vnodes = vnodesForComponent.get(vnode.type);
		if (!vnodes) {
			vnodesForComponent.set(vnode.type, [vnode]);
		} else {
			vnodes.push(vnode);
		}
	}

	if (oldVnode) oldVnode(vnode);
};

const oldDiffed = options[DIFFED_OPTION];
options[DIFFED_OPTION] = (oldVNode, newVNode) => {
	const type = (newVNode || {}).type;
	if (typeof type === 'function' && vnodesForComponent.has(type)) {
		const vnodes = vnodesForComponent.get(type);
		const index = vnodes.indexOf(oldVNode);
		if (index !== -1) {
			vnodes.splice(index, 1);
		}
	}

	if (
		typeof type === 'function' &&
		newVNode[VNODE_COMPONENT] &&
		newVNode[VNODE_COMPONENT][COMPONENT_HOOKS]
	) {
		const hooks = newVNode[VNODE_COMPONENT][COMPONENT_HOOKS];
		(hooks.__ || []).forEach(listItem => {
			if (!listItem[HOT_RELOAD_ID]) {
				listItem[HOT_RELOAD_ID] = Symbol(HOT_RELOAD_ID);
			}
		});
	}

	if (oldDiffed) oldDiffed(oldVNode, newVNode);
};

const oldUnmount = options.unmount;
options.unmount = vnode => {
	const type = (vnode || {}).type;
	if (typeof type === 'function' && vnodesForComponent.has(type)) {
		const vnodes = vnodesForComponent.get(type);
		const index = vnodes.indexOf(vnode);
		if (index !== -1) {
			vnodes.splice(index, 1);
		}
	}
	if (oldUnmount) oldUnmount(vnode);
};

const oldHook = options[HOOK_OPTION];
options[HOOK_OPTION] = (comp, index, type) => {
	if (!comp[COMPONENT_HOOKS]) {
		comp[COMPONENT_HOOKS] = {
			[HOOKS_LIST]: [],
			[EFFECTS_LIST]: []
		};
	}

	if (!comp[COMPONENT_HOOKS][HOOKS_LIST][index]) {
		comp[COMPONENT_HOOKS][HOOKS_LIST].push({ type });
	}

	if (oldHook) oldHook(comp, index, type);
};
