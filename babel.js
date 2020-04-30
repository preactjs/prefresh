const plugin = ({ template, types: t }) => {
  let inConstructor = false;
  let _constructor = undefined;

  return {
    visitor: {
      ClassBody({ node }) {
        _constructor = t.classMethod("method", t.identifier("_constructor"), [], t.blockStatement([]));
        node.body.push(_constructor);
      },
      ClassMethod({ node }) {
        if (node.kind === "constructor") {
          inConstructor = true;
          node.body.body.push(t.expressionStatement(t.callExpression(t.identifier("_constructor"), [])));
        } else {
          inConstructor = false;
        }
      },
      ExpressionStatement(path) {
        const { node } = path;
        if (inConstructor && node.expression.right && node.expression.right.callee && node.expression.right.callee.property.name === "bind") {
          _constructor.body.body.push(node);
          path.remove();
        }
      }
    }
  };
};

export default plugin;
