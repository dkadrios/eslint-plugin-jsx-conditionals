const permissableFunctions = [
  'Boolean',
  'equals',
  'has',
  'isDefined',
  'isValidDateRange',
  'matches',
  'matchesOneOf',
  'not',
]

module.exports = {
  meta: {
    docs: {
      description:
        'Ensure variables in JSX conditionals are always cast to booleans, to avoid unwanted side effects with other falsey values like empty strings etc.',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    return {
      JSXExpressionContainer: function (node) {
        if (node.expression.type === 'LogicalExpression') {
          const exp = node.expression
          if (
            exp.operator === '&&' &&
            exp.left.type !== 'UnaryExpression' &&
            exp.left.type !== 'BinaryExpression' &&
            !(
              exp.left.type === 'CallExpression' &&
              (permissableFunctions.includes(exp.left.callee.name) ||
                (exp.left.callee.callee &&
                  permissableFunctions.includes(exp.left.callee.callee.name)))
            )
          ) {
            context.report(
              exp.left,
              'Logical expressions must be cast to booleans'
            )
          }
        }
      },
    }
  },
}
