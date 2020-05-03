import { options, Component } from 'preact';

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

		if (vnode.__c) {
			vnode.__c.constructor = vnode.type;

			try {
				if (vnode.__c instanceof OldType) {
					const oldInst = vnode.__c;
					const newInst = new NewType(vnode.__c.props, vnode.__c.context);
					vnode.__c = newInst;
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

			if (vnode.__c.__H) {
				const visited = new WeakSet();
				const hooks = vnode.__c.__H;
				const oldOptionsHook = options.__h;
				options.__h = (component, index, type) => {
					const hooks = component.__H.__;
					if (hooks[index].type !== type) {
						hooks.splice(index, 0, { type });
					} else if (hooks[index].__hot_reload_id__) {
						visited.add(hooks[index].__hot_reload_id__);
					}

					if (oldOptionsHook) oldOptionsHook(component, index, type);
				};

				Component.prototype.forceUpdate.call(vnode.__c, () => {
					// We have finished the update, all that's left to do is check whether
					// or not we have unvisited hooks, if we do we can safely remove them since
					// this code could've been removed.
					vnode.__c.__H.__.forEach(({ __hot_reload_id__: hotReloadId }, i) => {
						if (hotReloadId && !visited.has(hotReloadId)) {
							hooks.__.splice(i, 1);
						}
					});
					options.__h = oldOptionsHook;
				});
			} else {
				Component.prototype.forceUpdate.call(vnode.__c);
			}
		}
	});
}

window.__PREACT__ = { replaceComponent };

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

const oldDiffed = options.__b;
options.__b = (oldVNode, newVNode) => {
	const type = (newVNode || {}).type;
	if (typeof type === 'function' && vnodesForComponent.has(type)) {
		const vnodes = vnodesForComponent.get(type);
		const index = vnodes.indexOf(oldVNode);
		if (index !== -1) {
			vnodes.splice(index, 1);
		}
	}

	if (typeof type === 'function' && newVNode.__c && newVNode.__c.__H) {
		const hooks = newVNode.__c.__H;
		(hooks.__ || []).forEach(listItem => {
			if (!listItem.__hot_reload_id__) {
				listItem.__hot_reload_id__ = Symbol('__hot_reload_id__');
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

const oldHook = options.__h;
options.__h = (comp, index, type) => {
	if (!comp.__H) {
		comp.__H = {
			__: [], // _list
			__h: [] // _pendingEffects
		};
	}

	if (!comp.__H.__[index]) {
		comp.__H.__.push({ type });
	}

	if (oldHook) oldHook(comp, index, type);
};
