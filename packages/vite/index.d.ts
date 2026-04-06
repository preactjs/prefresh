import { FilterPattern } from '@rollup/pluginutils';
import { PluginOption } from 'vite';

interface Options {
  parserPlugins?: readonly string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

declare const prefreshPlugin: (options?: Options) => Promise<PluginOption>;

export = prefreshPlugin;
