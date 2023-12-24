import { FilterPattern } from '@rollup/pluginutils';
import { Plugin } from 'vite';

interface Options {
  parserPlugins?: readonly string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

declare const prefreshPlugin: (options?: Options) => Plugin;

export = prefreshPlugin;
