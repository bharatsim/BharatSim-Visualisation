const { parseExpression } = require('../../src/utils/expressionParser');

describe('expression Parser', () => {
  describe('should transform expression into mongo readable query', function () {
    const expressions = [
      '1 + 20',
      '"field1" + "field2"',
      '"field2" * "field1" * (1 + 20)',
      'add(1,2) / "field"',
      '"col1"',
      'sum()',
      'col1 + col2',
      'col1',
    ];
    const parsedExpression = [
      { $add: [1, 20] },
      { $add: ['$field1', '$field2'] },
      { $multiply: [{ $multiply: ['$field2', '$field1'] }, { $add: [1, 20] }] },
      { $divide: [{ $add: [1, 2] }, '$field'] },
      '$col1',
      { $sum: [] },
      { $add: ['$col1', '$col2'] },
      '$col1',
    ];

    expressions.forEach((expression, index) => {
      it(`should provide parsed expression for ${expression}`, function () {
        expect(parseExpression(expression)).toEqual(parsedExpression[index]);
      });
    });
  });

  it('should throw error if expression is wrong', function () {
    const expressions = '';
    const res = () => parseExpression(expressions);
    expect(res).toThrowError('1015 - Invalid Input - Given expression for column is invalid');
  });
});
