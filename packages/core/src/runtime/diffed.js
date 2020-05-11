import { options } from 'preact';
import {
	DIFFED_OPTION,
	VNODE_COMPONENT,
	COMPONENT_HOOKS,
	HOT_RELOAD_ID
} from '../constants';
import { vnodesForComponent } from './vnodesForComponent';

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
