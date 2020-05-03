import { options } from 'preact';
import {
	HOOK_OPTION,
	COMPONENT_HOOKS,
	HOOKS_LIST,
	EFFECTS_LIST
} from '../constants';

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
