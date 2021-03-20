import { loader } from 'webpack';
import prefreshRuntime from './runtime';

let prefreshRuntime = prefreshRuntime.toString();
prefreshRuntime = prefreshRuntime.slice(
  prefreshRuntime.indexOf('{') + 1,
  prefreshRuntime.lastIndexOf('}')
);

const ReactRefreshLoader: loader.Loader = function ReactRefreshLoader(
  source,
  inputSourceMap
) {
  this.callback(null, `${source}\n\n;${prefreshRuntime}`, inputSourceMap);
};

export default ReactRefreshLoader;
