import type { Plugin } from 'rolldown';

export interface PrefreshRolldownOptions {
  library?: string[];
  enabled?: boolean;
}

declare function prefreshPlugin(options?: PrefreshRolldownOptions): Plugin;

export default prefreshPlugin;
export { prefreshPlugin as prefresh };
