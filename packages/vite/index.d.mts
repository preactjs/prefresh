import { PluginOption } from 'vite';

type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;

interface Options {
  parserPlugins?: readonly string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

declare const prefreshPlugin: (options?: Options) => Promise<PluginOption>;

export default prefreshPlugin;
