const { validateExpression } = require('../../src/utils/expressionParser');
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

  describe('validate expression ', () => {
    const fields = ['field1', 'field2', 'field3', 'col1', 'col2'];
    it('should provide error if expression is empty', () => {
      const res = () => {
        validateExpression('', fields);
      };
      expect(res).toThrowError('1015 - Invalid Input - Given expression for column is invalid');
    });

    it('should provide error if expression is invalid', () => {
      const res = () => {
        validateExpression('"field1" "field2"', fields);
      };
      expect(res).toThrowError('1015 - Invalid Input - Given expression for column is invalid');
    });

    it('should provide error if expression is invalid with in complete bracket', () => {
      const res = () => {
        validateExpression('( "field1" +  "field2" ) + (', fields);
      };
      expect(res).toThrowError('1015 - Invalid Input - Given expression for column is invalid');
    });
    it('should provide error if expression has invalid field', () => {
      const res = () => {
        validateExpression('( "field5" +  "field2" )', fields);
      };
      expect(res).toThrowError('1015 - Invalid Input - Given expression for column is invalid');
    });

    const expressions = [
      '1 + 20',
      '"field1" + "field2"',
      '"field2" * "field1" * (1 + 20)',
      'add(1,2) / "field1"',
      '"col1"',
      'sum()',
      'col1 + col2',
      'col1',
    ];

    expressions.forEach((expression) => {
      it(`should not throw error if expression is valid ${expression}`, () => {
        const res = () => {
          validateExpression(expression, fields);
        };
        expect(res).not.toThrowError();
      });
    });
  });
});
