import { options, Component } from 'preact';

// all vnodes referencing a given constructor
const vnodesForComponent = new WeakMap();

function replaceComponent(oldType, newType) {
	const vnodes = vnodesForComponent.get(oldType);
	if (!vnodes) return;

	// migrate the list to our new constructor reference
	vnodesForComponent.delete(oldType);
	vnodesForComponent.set(newType, vnodes);

	vnodes.forEach(vnode => {
		// update the type in-place to reference the new component
		vnode.type = newType;

		if (vnode.__c) {
			vnode.__c.constructor = vnode.type;
			if (vnode.__c.__H) {
				// Reset hooks state
				vnode.__c.__H = {
					__: [], // _list
					__h: [] // _pendingEffects
				};
			}

			// if this was/is a class component:
			if (vnode.__c instanceof oldType) {
				const oldInst = vnode.__c;
				const newInst = new newType(vnode.__c.props, vnode.__c.context);
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

			Component.prototype.forceUpdate.call(vnode.__c);
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
