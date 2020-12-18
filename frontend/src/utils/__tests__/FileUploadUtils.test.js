import { getMessage, parseCsv, parseJson, resetFileInput } from '../fileUploadUtils';

jest.mock('papaparse', () => ({
  parse: (csvFile, config) => {
    config.complete('data');
  },
}));

const readAsTextMock = jest.fn();
let jsonString = '{}';
jest.spyOn(global, 'FileReader').mockImplementation(function () {
  const self = this;
  this.readAsText = readAsTextMock.mockImplementation(() => {
    self.onload({ target: { result: jsonString } });
  });
});

describe('File Upload utils', () => {
  it('should provide status and message for file uploading', () => {
    const expected = 'uploading file.csv';

    const actual = getMessage('LOADING', 'file.csv');

    expect(actual).toEqual(expected);
  });

  it('should provide status and message for file uploading error', () => {
    const expected = 'Error occurred while unloading file.csv';

    const actual = getMessage('ERROR', 'file.csv');

    expect(actual).toEqual(expected);
  });

  it('should provide status and message for file uploading success', () => {
    const expected = 'file.csv successfully uploaded';

    const actual = getMessage('SUCCESS', 'file.csv');

    expect(actual).toEqual(expected);
  });

  it('should parse the csv file and call the given function', () => {
    const previewLimit = 100;
    const onApply = jest.fn();

    parseCsv('MockFile', previewLimit, onApply);

    expect(onApply).toHaveBeenCalledWith('data');
  });
  // TODO: update test to check if on apply has been called
  it('should parse the json file and call the given function', () => {
    const onApply = jest.fn();
    parseJson('MockFile', onApply);
    expect(readAsTextMock).toHaveBeenCalledWith('MockFile');
    expect(onApply).toHaveBeenCalledWith({
      data: {},
      errors: [],
    });
  });
  it('should parse the json file and call the given function and send error if any', () => {
    jsonString = '{';
    const onApply = jest.fn();
    parseJson('MockFile', onApply);
    expect(readAsTextMock).toHaveBeenCalledWith('MockFile');
    expect(onApply).toHaveBeenCalledWith({
      data: {},
      errors: ['SyntaxError: Unexpected end of JSON input'],
    });
  });
  it('should reset file input', () => {
    const fileInput = {
      value: 'file',
      files: [],
    };

    resetFileInput(fileInput);

    expect(fileInput).toEqual({
      value: '',
      files: null,
    });
  });
});
