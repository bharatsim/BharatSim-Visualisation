import React from 'react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../theme/withThemeProvider';
import ImportDataset from '../ImportDataset';
import * as fileUtils from '../../../utils/fileUploadUtils';
import { renderWithRedux as render } from '../../../testUtil';

jest.spyOn(fileUtils, 'parseCsv').mockImplementation((csvFile, previewLimit, onComplete) => {
  const data = {
    data: [{ col1: 'row1', col2: 1 }],
    errors: [],
    meta: { fields: ['col1', 'col2'] },
  };
  onComplete(data);
});

jest.spyOn(fileUtils, 'parseJson').mockImplementation((jsonFile, onComplete) => {
  const data = { data: [{ col1: 'row1', col2: 1 }], errors: [] };
  onComplete(data);
});

describe('Import Dataset', () => {
  const Component = withThemeProvider(ImportDataset);
  let setFileMock;
  let handleNextMock;
  let setPreviewDataMock;
  let setErrorStepMock;
  let setSchemaMock;
  beforeEach(() => {
    setFileMock = jest.fn();
    handleNextMock = jest.fn();
    setPreviewDataMock = jest.fn();
    setErrorStepMock = jest.fn();
    setSchemaMock = jest.fn();
  });

  it('should match snapshot for import dataset component', () => {
    const { container } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should import and set csv file ', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '10' }] },
    });

    expect(setFileMock).toHaveBeenCalledWith({ name: 'test.csv', size: '10' });
  });
  it('should import and parse csv file ', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '10' }] },
    });

    expect(fileUtils.parseCsv).toHaveBeenCalledWith(
      { name: 'test.csv', size: '10' },
      100,
      expect.any(Function, () => {}),
    );
  });
  it('should import and parse json file', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.json', size: '10' }] },
    });

    expect(fileUtils.parseJson).toHaveBeenCalledWith(
      { name: 'test.json', size: '10' },
      expect.any(Function, () => {}),
    );
  });

  it('should create and set schema for csv files', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '10' }] },
    });

    expect(setSchemaMock).toHaveBeenCalledWith({
      col1: 'String',
      col2: 'Number',
    });
  });
  it('should set preview data for csv file', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '10' }] },
    });

    expect(setPreviewDataMock).toHaveBeenCalledWith([{ col1: 'row1', col2: 1 }]);
  });
  it('should set preview data for json file', () => {
    const { getByTestId } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.json', size: '10' }] },
    });

    expect(setPreviewDataMock).toHaveBeenCalledWith([{ col1: 'row1', col2: 1 }]);
  });
  it('should set error for any parsing error in given csv file', () => {
    jest.spyOn(fileUtils, 'parseCsv').mockImplementation((csvFile, previewLimit, onComplete) => {
      const data = {
        data: [{ col1: 'row1', col2: 1 }],
        errors: ['error'],
        meta: { fields: ['col1', 'col2'] },
      };
      onComplete(data);
    });
    const { getByTestId, queryByText } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '10' }] },
    });

    expect(
      queryByText(
        'Failed to Import file due to parsing error. Please review the file and ensure that its a valid CSV file.',
      ),
    ).toBeInTheDocument();
    expect(setErrorStepMock).toHaveBeenCalledWith(0);
  });
  it('should set error for any parsing error in given json file', () => {
    jest.spyOn(fileUtils, 'parseJson').mockImplementation((csvFile, onComplete) => {
      const data = { data: [{ col1: 'row1', col2: 1 }], errors: ['error'] };
      onComplete(data);
    });
    const { getByTestId, queryByText } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.json', size: '10' }] },
    });

    expect(
      queryByText(
        'Failed to Import file due to parsing error. Please review the file and ensure that its a valid JSON Data.',
      ),
    ).toBeInTheDocument();
    expect(setErrorStepMock).toHaveBeenCalledWith(0);
  });
  it('should set validation error for given file if size exceed limit of 300mb', () => {
    jest.spyOn(fileUtils, 'parseCsv').mockImplementation((csvFile, previewLimit, onComplete) => {
      const data = {
        data: [{ col1: 'row1', col2: 1 }],
        errors: [],
        meta: { fields: ['col1', 'col2'] },
      };
      onComplete(data);
    });
    const { getByTestId, queryByText } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'test.csv', size: '120843092842123' }] },
    });

    expect(
      queryByText('Failed to Import file, size exceeds the limit of 300MB'),
    ).toBeInTheDocument();
    expect(setErrorStepMock).toHaveBeenCalledWith(0);
  });
  it('should set validation error for given file if type if not supported', () => {
    jest.spyOn(fileUtils, 'parseCsv').mockImplementation((csvFile, previewLimit, onComplete) => {
      const data = {
        data: [{ col1: 'row1', col2: 1 }],
        errors: [],
        meta: { fields: ['col1', 'col2'] },
      };
      onComplete(data);
    });
    const { getByTestId, queryByText } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'file.txt', size: '120843092842123' }] },
    });

    expect(queryByText('Failed to Import file, the format is not supported')).toBeInTheDocument();
    expect(setErrorStepMock).toHaveBeenCalledWith(0);
  });
  it('should set validation error for given file if csv file has _id as column', () => {
    jest.spyOn(fileUtils, 'parseCsv').mockImplementation((csvFile, previewLimit, onComplete) => {
      const data = { data: [{ _id: 'row1', col2: 1 }], errors: [], meta: { fields: ['_id'] } };
      onComplete(data);
    });
    const { getByTestId, queryByText } = render(
      <Component
        setFile={setFileMock}
        handleNext={handleNextMock}
        setPreviewData={setPreviewDataMock}
        setErrorStep={setErrorStepMock}
        setSchema={setSchemaMock}
      />,
    );
    const inputComponent = getByTestId('file-input');

    fireEvent.change(inputComponent, {
      target: { files: [{ name: 'file.csv', size: '120843092' }] },
    });

    expect(
      queryByText('Failed to Import file due to wrong column name. Please change _id column name'),
    ).toBeInTheDocument();
    expect(setErrorStepMock).toHaveBeenCalledWith(0);
  });
});
