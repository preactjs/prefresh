import { options } from 'preact';
import { DIFFED_OPTION } from '../constants';
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

	if (oldDiffed) oldDiffed(oldVNode, newVNode);
};
