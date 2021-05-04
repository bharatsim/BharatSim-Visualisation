import {
  validateFile,
  required,
  validateStepSize,
  validateOpacity,
  validateToValueNumber,
  validateToValueDate,
  validateWidth,
  validateExpression,
} from '../validators';

describe('Validators', () => {
  describe('required', () => {
    it('should provide message if value is not undefined, null or empty string', () => {
      expect(required(undefined)).toEqual('Field is required');
      expect(required(null)).toEqual('Field is required');
      expect(required('')).toEqual('Field is required');
    });
  });

  describe('step size validator', () => {
    it('should provide message if step size is undefined', () => {
      expect(validateStepSize()).toEqual('Field is required');
    });

    it('should provide message if step size is less than 1', () => {
      expect(validateStepSize(0)).toEqual('Step size should be greater than equal to 1');
    });

    it('should provide message if step size is not valid integer', () => {
      expect(validateStepSize(2.2)).toEqual('Step size should be integer');
    });

    it('should provide empty message for valid step size', () => {
      expect(validateStepSize(2)).toEqual('');
    });
  });

  describe('Opacity validator', () => {
    it('should provide message if opacity is undefined', () => {
      expect(validateOpacity()).toEqual('Field is required');
    });

    it('should provide message if opacity is greater than 1', () => {
      expect(validateOpacity(-1)).toEqual('Opacity should be between 0 to 1');
    });

    it('should provide message if opacity is lass than 0', () => {
      expect(validateOpacity(1.1)).toEqual('Opacity should be between 0 to 1');
    });

    it('should provide empty message for valid opacity', () => {
      expect(validateOpacity(0.2)).toEqual('');
    });
  });

  describe('validate ToValue Number', () => {
    it('should provide message if to value is undefined', () => {
      expect(validateToValueNumber()).toEqual('Field is required');
    });

    it('should provide message if to value is less than from value', () => {
      expect(validateToValueNumber(2, 5)).toEqual('To value should be greater than from value');
    });

    it('should provide empty message for valid to value', () => {
      expect(validateToValueNumber(5, 2)).toEqual('');
    });
  });

  describe('validate ToValue Date', () => {
    it('should provide message if to value is undefined', () => {
      expect(validateToValueDate()).toEqual('Field is required');
    });

    it('should provide message if to value is less than from value', () => {
      expect(validateToValueDate('2001, Jan 12', '2002, Jan 12')).toEqual(
        'To value should be greater than from value',
      );
    });

    it('should provide empty message for valid to value', () => {
      expect(validateToValueDate('2002, Jan 12', '2001, Jan 12')).toEqual('');
    });
  });

  describe('file validator', () => {
    it('should provide message if file is not present', () => {
      expect(validateFile()).toEqual('Please upload valid file');
    });

    it('should provide message if uploaded file is not type of csv', () => {
      expect(validateFile({ size: 10000, name: 'file.png' })).toEqual(
        'Failed to Import file, the format is not supported',
      );
    });

    it('should provide message if uploaded file size exceed limit of 300MB', () => {
      expect(validateFile({ size: 314572805, name: 'test.csv' })).toEqual(
        'Failed to Import file, size exceeds the limit of 300MB',
      );
    });

    it('should provide empty message for valid file', () => {
      expect(validateFile({ size: 1000, name: 'test.csv' })).toEqual('');
    });
  });

  describe('validate width ', () => {
    it('should provide message if to value is undefined', () => {
      expect(validateWidth()).toEqual('Field is required');
    });

    it('should provide message if to value is less than or equal to 0', () => {
      expect(validateWidth(0)).toEqual('Width should be greater than 0');
      expect(validateWidth(-1)).toEqual('Width should be greater than 0');
    });

    it('should provide empty message for valid to value', () => {
      expect(validateWidth(1)).toEqual('');
    });
  });

  describe('validate expression ', () => {
    const fields = ['field1', 'field2', 'field3', 'col1', 'col2'];
    it('should provide error if expression is empty', () => {
      const res = () => {
        validateExpression('', fields);
      };
      expect(res).toThrowError('Expression can not be empty');
    });

    it('should provide error if expression is invalid', () => {
      const res = () => {
        validateExpression('"field1" "field2"', fields);
      };
      expect(res).toThrowError('Unexpected operator " (char 10)');
    });

    it('should provide error if expression is invalid with in complete bracket', () => {
      const res = () => {
        validateExpression('( "field1" +  "field2" ) + (', fields);
      };
      expect(res).toThrowError('Unexpected end of expression (char 29)');
    });
    it('should provide error if expression has invalid field', () => {
      const res = () => {
        validateExpression('( "field5" +  "field2" )', fields);
      };
      expect(res).toThrowError('field5 field does not exists');
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
