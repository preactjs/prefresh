import { createHash } from 'node:crypto';
import { withMagicString } from 'rolldown-string';
import { Visitor } from 'rolldown/utils';
import { ScopedVisitor } from 'oxc-unshadowed-visitor';

const DEFAULT_LIBRARY = ['preact', 'react', 'preact/compat'];
const SCRIPT_LANG_RE = /\.(c|m)?(t|j)sx?$/;
const walk = (program, visitor) => new Visitor(visitor).visit(program);

function getLang(id) {
  if (/\.(c|m)?tsx$/.test(id)) return 'tsx';
  if (/\.(c|m)?ts$/.test(id)) return 'ts';
  if (/\.(c|m)?jsx$/.test(id)) return 'jsx';
  return 'js';
}

function createFileHash(id) {
  return createHash('sha256').update(id).digest('hex').slice(0, 16);
}

function getSimpleParamNames(params) {
  const names = [];
  for (const parameter of params) {
    if (parameter.type === 'Identifier') names.push(parameter.name);
  }
  return names;
}

function getObjectPatternKey(property) {
  if (property.computed) return null;
  if (property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal') return String(property.key.value);
  return null;
}

function buildContextKey(fileHash, parentKey, count, paramNames) {
  const base = `${fileHash}${parentKey}${count}`;
  if (paramNames.length === 0) return `\`${base}\``;

  const suffix = paramNames.map(name => `\${${name}}`).join('');
  return `\`${base}_${suffix}\``;
}

export default function prefreshPlugin(options = {}) {
  const libraries = new Set(options.library || DEFAULT_LIBRARY);
  let isEnabled = options.enabled;

  const plugin = {
    name: 'prefresh-rolldown',
    enforce: 'pre',
    configResolved(config) {
      isEnabled ??= !config.isProduction;
    },
    outputOptions() {
      if ('viteVersion' in this.meta) return;
      isEnabled ??= process.env.NODE_ENV === 'development';
    },
    transform: {
      filter: {
        id: SCRIPT_LANG_RE,
        code: {
          include: 'createContext',
        },
      },
      handler: withMagicString(function (s, id, meta) {
        if (!isEnabled) return;

        const program =
          meta?.ast || this.parse(s.original, { lang: getLang(id) });
        const namedImports = new Set();
        const namespaceImports = new Set();

        for (const node of program.body) {
          if (node.type !== 'ImportDeclaration') continue;
          if (!libraries.has(node.source.value)) continue;

          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const importedName =
                specifier.imported.type === 'Identifier'
                  ? specifier.imported.name
                  : specifier.imported.value;

              if (importedName === 'createContext') {
                namedImports.add(specifier.local.name);
              }
            } else if (
              specifier.type === 'ImportDefaultSpecifier' ||
              specifier.type === 'ImportNamespaceSpecifier'
            ) {
              namespaceImports.add(specifier.local.name);
            }
          }
        }

        const trackedNames = [...namedImports, ...namespaceImports];
        if (trackedNames.length === 0) return;

        const paramNamesStack = [[]];
        const parentKeyStack = [''];
        let objectPatternDepth = 0;

        const visitor = new ScopedVisitor({
          trackedNames,
          walk,
          visitor: {
            FunctionDeclaration(node) {
              paramNamesStack.push(getSimpleParamNames(node.params));
            },
            'FunctionDeclaration:exit'() {
              paramNamesStack.pop();
            },
            FunctionExpression(node) {
              paramNamesStack.push(getSimpleParamNames(node.params));
            },
            'FunctionExpression:exit'() {
              paramNamesStack.pop();
            },
            ArrowFunctionExpression(node) {
              paramNamesStack.push(getSimpleParamNames(node.params));
            },
            'ArrowFunctionExpression:exit'() {
              paramNamesStack.pop();
            },
            VariableDeclarator(node) {
              if (node.id.type === 'Identifier') {
                parentKeyStack.push(`$${node.id.name}`);
              } else {
                parentKeyStack.push(parentKeyStack[parentKeyStack.length - 1]);
              }
            },
            'VariableDeclarator:exit'() {
              parentKeyStack.pop();
            },
            AssignmentExpression(node) {
              if (node.left.type === 'Identifier') {
                parentKeyStack.push(`_${node.left.name}`);
              } else {
                parentKeyStack.push(parentKeyStack[parentKeyStack.length - 1]);
              }
            },
            'AssignmentExpression:exit'() {
              parentKeyStack.pop();
            },
            ObjectPattern() {
              objectPatternDepth++;
            },
            'ObjectPattern:exit'() {
              objectPatternDepth--;
            },
            Property(node) {
              if (objectPatternDepth > 0) {
                const key = getObjectPatternKey(node);
                if (key) {
                  parentKeyStack.push(`__${key}`);
                  return;
                }
              }

              parentKeyStack.push(parentKeyStack[parentKeyStack.length - 1]);
            },
            'Property:exit'() {
              parentKeyStack.pop();
            },
            CallExpression(node, ctx) {
              const callee = node.callee;
              const parentKey = parentKeyStack[parentKeyStack.length - 1];
              const paramNames = paramNamesStack[paramNamesStack.length - 1];

              if (
                callee.type === 'Identifier' &&
                namedImports.has(callee.name)
              ) {
                ctx.record({
                  name: callee.name,
                  node,
                  data: { callNode: node, parentKey, paramNames },
                });
                return;
              }

              if (
                callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                namespaceImports.has(callee.object.name)
              ) {
                const isCreateContext = callee.computed
                  ? callee.property.type === 'Literal' &&
                    typeof callee.property.value === 'string' &&
                    callee.property.value === 'createContext'
                  : callee.property.type === 'Identifier' &&
                    callee.property.name === 'createContext';

                if (isCreateContext) {
                  ctx.record({
                    name: callee.object.name,
                    node,
                    data: { callNode: node, parentKey, paramNames },
                  });
                }
              }
            },
          },
        });

        const records = visitor.walk(program);
        if (records.length === 0) return;

        const counters = new Map();
        const fileHash = createFileHash(id);

        for (const record of records) {
          const { callNode, parentKey, paramNames } = record.data;
          const counter = (counters.get(parentKey) || 0) + 1;
          counters.set(parentKey, counter);

          const callee = s.slice(callNode.callee.start, callNode.callee.end);
          const key = buildContextKey(fileHash, parentKey, counter, paramNames);
          const firstArg = callNode.arguments[0];

          if (firstArg && firstArg.type !== 'SpreadElement') {
            const value = s.slice(firstArg.start, firstArg.end);
            s.update(
              callNode.start,
              callNode.end,
              `Object.assign(${callee}[${key}] || (${callee}[${key}] = ${callee}(${value})), { __: ${value} })`
            );
            continue;
          }

          s.update(
            callNode.start,
            callNode.end,
            `${callee}[${key}] || (${callee}[${key}] = ${callee}())`
          );
        }
      }),
    },
  };

  return plugin;
}

export const prefresh = prefreshPlugin;
