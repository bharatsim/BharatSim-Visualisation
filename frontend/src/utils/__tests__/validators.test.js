import { validateFile, required } from '../validators';

describe('Validators', () => {
  describe('required', () => {
    it('should provide message if value is not undefined, null or empty string', () => {
      expect(required(undefined)).toEqual('Field is required');
      expect(required(null)).toEqual('Field is required');
      expect(required('')).toEqual('Field is required');
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
