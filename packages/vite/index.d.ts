import { FilterPattern } from '@rollup/pluginutils';
import { Plugin } from 'vite';

export interface Options {
  parserPlugins?: readonly string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

declare const prefreshPlugin: (options?: Options) => Plugin;

export default prefreshPlugin;
