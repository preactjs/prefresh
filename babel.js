const property = '__refresh_constructor__';

function extractComponentConstructors ({ template, types: t }) => {
  return {
    name: 'transform-extract-component-constructors',
    visitor: {
      ClassMethod(path) {
        if (path.node.kind !== "constructor") return;
        
        const classBody = path.parent.body;
        const hasRenderMethod = classBody.some(
          p => t.isClassMethod(p) && t.isIdentifier(p.key, {name:'render'})
        );
        // no render() method, not a Component.
        if (!hasRenderMethod) return;

        // extract everything *except* the super() call
        const body = path.get('body.body').reduce((body, p) => {
          let expr = t.isExpressionStatement(p) ? p.get('expression') : p;
          if (!t.isCallExpression(expr) || !t.isSuper(expr.get('callee'))) {
            body.push(t.clone(p.node));
            p.remove();
          }
          return body;
        }, []);
        
        path.get('body').pushContainer(
          'body',
          t.callExpression(
            t.memberExpression(
              t.thisExpression(),
              t.identifier(property)
            ),
            path.node.params.map(t.clone)
          )
        );
        
        path.insertAfter(
          t.classMethod(
            'method',
            t.identifier(property),
            path.node.params.map(t.clone),
            t.blockStatement(body)
          )
        );
      }
    }
  };
};

module.exports = extractComponentConstructors;
