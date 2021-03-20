import prefreshRuntime from './runtime';

let prefreshModuleRuntime = prefreshRuntime.toString();
prefreshModuleRuntime = prefreshModuleRuntime.slice(
  prefreshModuleRuntime.indexOf('{') + 1,
  prefreshModuleRuntime.lastIndexOf('}')
);

const PrefreshLoader = function PrefreshLoader(source, inputSourceMap) {
  this.callback(null, `${source}\n\n;${prefreshModuleRuntime}`, inputSourceMap);
};

export default PrefreshLoader;
