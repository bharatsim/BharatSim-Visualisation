import { datasourceValidator, validateFile, xAxisValidator, yAxisValidator } from '../validators';

describe('Validators', () => {
  describe('X axis validator', () => {
    it('should provide message if x axis value is not present', () => {
      expect(xAxisValidator('')).toEqual('Please select value for x axis');
    });

    it('should provide empty message if x axis value is present', () => {
      expect(xAxisValidator('test')).toEqual('');
    });

    it('should provide message if x axis value is undefined', () => {
      expect(xAxisValidator()).toEqual('Please select value for x axis');
    });
  });

  describe('Y axis validator', () => {
    it('should provide message if y axis value is not present', () => {
      expect(yAxisValidator(null)).toEqual('Please select valid value for y axis');
    });

    it('should provide message if y axis value undefined', () => {
      expect(yAxisValidator()).toEqual('Please select value for y axis');
    });
    it('should provide message if any of the field is empty', () => {
      expect(yAxisValidator([{ name: 'y-axis', type: 'number' }, ''])).toEqual(
        'Please select value for y axis',
      );
    });

    it('should provide empty message if selected y axis type is number', () => {
      expect(yAxisValidator([{ name: 'y-axis', type: 'number' }])).toEqual('');
    });

    it('should provide empty message if selected y axis type is Number', () => {
      expect(yAxisValidator([{ name: 'y-axis', type: 'Number' }])).toEqual('');
    });
  });

  describe('datasource validator', () => {
    it('should provide message if datasource value is not present', () => {
      expect(datasourceValidator('')).toEqual('Please select data source');
    });

    it('should provide empty message if datasource value is present', () => {
      expect(datasourceValidator('test')).toEqual('');
    });

    it('should provide message if datasource value is undefined', () => {
      expect(datasourceValidator()).toEqual('Please select data source');
    });
  });

  describe('file validator', () => {
    it('should provide message if file is not present', () => {
      expect(validateFile()).toEqual('Please upload valid csv file');
    });

    it('should provide message if uploaded file is not type of csv', () => {
      expect(validateFile({ type: 'image/png', size: 10000 })).toEqual(
        'Failed to Import file, the format is not supported',
      );
    });

    it('should provide message if uploaded file size exceed limit of 10MB', () => {
      expect(validateFile({ type: 'text/csv', size: 10485761 })).toEqual(
        'Failed to Import file, size exceeds the limit of 10MB',
      );
    });

    it('should provide empty message for valid file', () => {
      expect(validateFile({ type: 'text/csv', size: 1000 })).toEqual('');
    });
  });
});
