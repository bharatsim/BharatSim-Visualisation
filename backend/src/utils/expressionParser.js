const { parse } = require('mathjs');

const { invalidExpression } = require('../exceptions/errors');
const InvalidInputException = require('../exceptions/InvalidInputException');

function parseExpression(expression) {
  const parsedExpression = parse(expression);
  return transformExpressionToFormula(parsedExpression);
}

function getConstantNodeValue(node) {
  return typeof node.value === 'string' ? `$${node.value}` : node.value;
}
function getSymbolNodeValue(node) {
  return `$${node.name}`;
}

function transformExpressionToFormula(node) {
  const result = {};
  const functionName = `$${node.fn}`;
  result[functionName] = [];
  if (!node.args && (node.type === 'ConstantNode' || node.type === 'SymbolNode')) {
    if (node.type === 'SymbolNode') {
      return getSymbolNodeValue(node);
    }
    return getConstantNodeValue(node);
  }

  node.args.forEach((arg) => {
    if (arg.type === 'ConstantNode') {
      const constantNodeVal = getConstantNodeValue(arg);
      result[functionName].push(constantNodeVal);
    }
    if (arg.type === 'SymbolNode') {
      result[functionName].push(`$${arg.name}`);
    }
    if (arg.type === 'FunctionNode') {
      result[functionName].push(transformExpressionToFormula(arg));
    }
    if (arg.type === 'OperatorNode') {
      result[functionName].push(transformExpressionToFormula(arg));
    }
    if (arg.type === 'ParenthesisNode') {
      result[functionName].push(transformExpressionToFormula(arg.content));
    }
  });

  return result;
}

function validateExpression(expression, fields) {
  if (!expression.trim()) {
    throw new InvalidInputException(invalidExpression.errorMessage, invalidExpression.errorCode);
  }
  try {
    const parsedExpression = parse(expression);
    validateFields(parsedExpression, fields);
  } catch (e) {
    throw new InvalidInputException(invalidExpression.errorMessage, invalidExpression.errorCode);
  }
}

function validateField(field, fields) {
  if (!fields.includes(field)) {
    throw new Error();
  }
}

function validateFields(node, fields) {
  if (node.type === 'ConstantNode' || node.type === 'SymbolNode') {
    if (node.type === 'SymbolNode') {
      validateField(node.name, fields);
      return;
    }
    if (node.type === 'ConstantNode' && typeof node.value === 'string') {
      validateField(node.value, fields);
      return;
    }
    return;
  }

  if (node.type === 'ParenthesisNode') {
    validateFields(node.content, fields);
    return;
  }

  node.args.forEach((arg) => {
    validateFields(arg, fields);
    if (arg.type === 'ParenthesisNode') {
      validateFields(arg.content, fields);
    }
  });
}

module.exports = {
  parseExpression,
  validateExpression,
};
