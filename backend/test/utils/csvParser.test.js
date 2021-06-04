const fs = require('fs');

const { validateAndParseCSV, validateColumnName } = require('../../src/utils/csvParser');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');

jest.mock('fs');

describe('CSV parser', function () {
  it('should provide parsed csv into json', function () {
    fs.readFileSync.mockReturnValue(`hour,susceptible,exposed
1,9999,1
2,9999,1
3,9999,1`);

    const parsedData = validateAndParseCSV('/csv');

    expect(parsedData).toEqual([
      { exposed: 1, hour: 1, susceptible: 9999 },
      { exposed: 1, hour: 2, susceptible: 9999 },
      { exposed: 1, hour: 3, susceptible: 9999 },
    ]);
  });

  it('should throw error for invalid csv', function () {
    fs.readFileSync.mockReturnValue(`hour,susceptible,exposed
1,9999,1
2,9999
3,9999,1`);

    const result = () => validateAndParseCSV('/csv');

    expect(result).toThrow(new InvalidInputException('Error while parsing csv ' +
      '- Please review the file and ensure that its a valid CSV file', 1011));
  });

  it('should throw error for csv if column name contain special character', function () {
    fs.readFileSync.mockReturnValue(`hour%, susceptible,exposed
1,9999,1
2,9999,1
3,9999,1`);

    const result = () => validateAndParseCSV('/csv');

    expect(result).toThrow(new InvalidInputException('Error while parsing csv' +
      ' - Column name can include alphabets, numbers, -, _ or space', 1011));
  });

  it('should throw error for csv if column name start without alphabet', function () {
    fs.readFileSync.mockReturnValue(`$hour, susceptible,exposed
1,9999,1
2,9999,1
3,9999,1`);

    const result = () => validateAndParseCSV('/csv');

    expect(result).toThrow(new InvalidInputException('Error while parsing csv' +
      ' - Column name should be start with alphabets', 1011));
  });
});

describe('validate column name',()=>{
  it('should provide error if name is empty',  () => {
    const columnName = "";
    const fields = ['col1', 'col2'];

    const error = validateColumnName(columnName, fields);

    expect(error).toEqual('Column name is required');
  });

  it('should provide error if column name start with alphabets',  () => {
    const columnName = "_columnName";
    const fields = ['col1', 'col2'];

    const error = validateColumnName(columnName, fields);

    expect(error).toEqual('Column name should be start with alphabets');
  });

  it('should provide error if column name contain special character',  () => {
    const columnName = "columneName%%";
    const fields = ['col1', 'col2'];

    const error = validateColumnName(columnName, fields);

    expect(error).toEqual('Column name can include alphabets, numbers, -, _ or space');
  });

  it('should provide error if column name is not unique',  () => {
    const columnName = "col1";
    const fields = ['col1', 'col2'];

    const error = validateColumnName(columnName, fields);

    expect(error).toEqual('Column Name should be unique');
  });

  it('should provide error if column name valid',  () => {
    const columnName = "col3";
    const fields = ['col1', 'col2'];

    const error = validateColumnName(columnName, fields);

    expect(error).toEqual('');
  });
})
