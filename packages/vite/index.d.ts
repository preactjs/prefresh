import { Plugin } from 'vite';

export interface Options {
  parserPlugins?: string[];
}

declare const prefreshPlugin: (options?: Options) => Plugin;

export default prefreshPlugin;
