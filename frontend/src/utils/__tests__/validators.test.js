import {
  chartNameValidator,
  datasourceValidator,
  validateFile,
  xAxisValidator,
  yAxisValidator,
} from '../validators';

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

  describe('chartName validator', () => {
    it('should provide message if chart name value is not present', () => {
      expect(chartNameValidator('')).toEqual('Please select chart name');
    });

    it('should provide empty message if chart name value is present', () => {
      expect(chartNameValidator('test')).toEqual('');
    });

    it('should provide message if chart name value is undefined', () => {
      expect(chartNameValidator()).toEqual('Please select chart name');
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
});
