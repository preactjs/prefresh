const plugin = ({ template, types: t }) => {
  let inConstructor = false;
  let _constructor = undefined;

  return {
    visitor: {
      ClassBody(path) {
        _constructor = t.classMethod("method", t.identifier("_constructor"), [], t.blockStatement([]));
        path.node.body.push(_constructor);
      },
      ClassMethod(path) {
        if (path.node.kind === "constructor") {
          inConstructor = true;
          path.node.body.body.push(
            t.expressionStatement(t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("_constructor")), []))
          );
        } else {
          inConstructor = false;
        }
      },
      ExpressionStatement(path) {
        const { node } = path;
        if (_constructor && inConstructor && node.expression.right && node.expression.right.callee && node.expression.right.callee.property.name === "bind") {
          _constructor.body.body.push(node);
          path.remove();
        }
      }
    }
  };
};

module.exports = plugin;