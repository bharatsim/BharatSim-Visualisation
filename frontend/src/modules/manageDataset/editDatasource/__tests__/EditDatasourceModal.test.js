/* eslint-disable no-console */
import React from 'react';
import { act, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../../theme/withThemeProvider';
import EditDataSourceModal from '../EditDatasourceModal';
import { api } from '../../../../utils/api';

const EDITOR_TEXTAREA = '.npm__react-simple-code-editor__textarea';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { col1: [1, 2, 3, 4, 5], col2: [6, 7, 8, 9, 10], col3: [1, 2, 3, 4, 5] },
    }),

    getDataSourceMetaData: jest.fn().mockResolvedValue({
      datasourceMetaData: {
        dataSourceSchema: { col1: 'Number', col2: 'Number', col3: 'Number', col4: 'Number' },
        customColumns: [{ name: 'col4', expression: '1 + 2' }],
      },
    }),
    addColumn: jest.fn().mockResolvedValue(''),
    deleteColumn: jest.fn().mockResolvedValue(''),
  },
}));

const EditDataSouceModelWithProvider = withThemeProvider(EditDataSourceModal);

describe('<EditDataSouceModel />', () => {
  // need to mock console error due to unsolved error of reference
  const { error } = console;
  beforeAll(() => {
    console.error = jest.fn();
  });
  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
  });
  afterAll(() => {
    console.error = error;
  });
  it('should match snapshot with table and empty custom column', async () => {
    api.getDataSourceMetaData.mockResolvedValueOnce({
      datasourceMetaData: {
        dataSourceSchema: { col1: 'Number', col2: 'Number', col3: 'Number', col4: 'Number' },
        customColumns: [],
      },
    });
    const { findByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );

    const container = document.querySelector('.MuiDialog-paper');

    await findByText('col1');

    expect(container).toMatchSnapshot();
  });

  it('should make column name disable in edit mode of column', async () => {
    const { findAllByText, getByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');
    await findAllByText('Custom column name');

    const col4NavBtn = getByTestId('col4');
    fireEvent.click(col4NavBtn);

    const textField = getByTestId('custom-column');

    expect(textField).toHaveAttribute('disabled', '');
  });

  it('should column expression field have expression of selected column ', async () => {
    const { findAllByText, getByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');
    await findAllByText('Custom column name');

    const col4NavBtn = getByTestId('col4');
    fireEvent.click(col4NavBtn);

    const textArea = document.querySelector(EDITOR_TEXTAREA);

    expect(textArea).toHaveValue('1 + 2');
  });

  it('should make column name enable for custom column', async () => {
    const { findAllByText, getByTestId, getByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    await findAllByText('Custom column name');

    const textField = getByTestId('custom-column');

    expect(textField).not.toHaveAttribute('disabled');
    expect(textField).toHaveValue('Untitled column');
  });

  it('should throw error if column name is duplicate', async () => {
    const { findAllByText, getByTestId, getByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    await findAllByText('Custom column name');

    const textField = getByTestId('custom-column');
    const textArea = document.querySelector(EDITOR_TEXTAREA);

    fireEvent.change(textField, { target: { value: 'col1' } });
    fireEvent.change(textArea, { target: { value: '1 + 10' } });

    fireEvent.click(getByText('Create column'));

    expect(getByText('Column Name should be unique.')).toBeInTheDocument();
  });

  it('should throw error if column name is empty', async () => {
    const { findAllByText, getByTestId, getByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    await findAllByText('Custom column name');

    const textField = getByTestId('custom-column');
    const textArea = document.querySelector(EDITOR_TEXTAREA);

    fireEvent.change(textField, { target: { value: '' } });
    fireEvent.change(textArea, { target: { value: '1 + 10' } });

    fireEvent.click(getByText('Create column'));

    expect(getByText('Column name is required.')).toBeInTheDocument();
  });

  it('should remove error once column name is change', async () => {
    const { findAllByText, getByTestId, getByText, queryByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    await findAllByText('Custom column name');

    const textField = getByTestId('custom-column');
    const textArea = document.querySelector(EDITOR_TEXTAREA);

    fireEvent.change(textField, { target: { value: 'col1' } });
    fireEvent.change(textArea, { target: { value: '1 + 10' } });

    fireEvent.click(getByText('Create column'));

    expect(queryByText('Column Name should be unique.')).toBeInTheDocument();

    fireEvent.change(textField, { target: { value: 'col6' } });

    expect(queryByText('Column Name should be unique.')).toBeNull();
  });

  it('should enable disable button if column is selected', async () => {
    const { findAllByText, getByTestId, queryByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    const col5NavBtn = getByTestId('col4');
    fireEvent.click(col5NavBtn);

    expect(queryByTestId('delete-col4')).not.toBeNull();
  });

  it('should show apply change button if column is in edit mode', async () => {
    const { findAllByText, getByTestId, queryByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    const col5NavBtn = getByTestId('col4');
    fireEvent.click(col5NavBtn);

    expect(queryByText('Apply changes')).not.toBeNull();
  });

  it('should create new column', async () => {
    const { findAllByText, getByTestId, getByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    const textField = getByTestId('custom-column');
    const textArea = document.querySelector(EDITOR_TEXTAREA);

    fireEvent.change(textField, { target: { value: 'newColumn1' } });
    fireEvent.change(textArea, { target: { value: '1 + 10' } });

    await act(async () => {
      fireEvent.click(getByText('Create column'));
    });

    expect(api.addColumn).toHaveBeenCalledWith('datasourceId', '1 + 10', 'newColumn1');
  });

  it('should create new column and update edit mode to true for column', async () => {
    const { findAllByText, getByTestId, getByText, queryByText } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    const textField = getByTestId('custom-column');
    const textArea = document.querySelector(EDITOR_TEXTAREA);

    fireEvent.change(textField, { target: { value: 'newColumn1' } });
    fireEvent.change(textArea, { target: { value: '1 + 10' } });

    await act(async () => {
      fireEvent.click(getByText('Create column'));
    });

    await findAllByText('newColumn1');

    expect(queryByText('Apply changes')).toBeInTheDocument();
  });

  it('should delete column', async () => {
    const { findAllByText, getByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    const col1 = getByTestId('col4');
    fireEvent.click(col1);

    fireEvent.click(getByTestId('delete-col4'));
    await act(async () => {
      fireEvent.click(getByTestId('delete-custom-column'));
    });

    expect(api.deleteColumn).toHaveBeenCalledWith({
      columnName: 'col4',
      datasourceId: 'datasourceId',
    });
  });

  it('should delete column which are not saved yet without showing a modal', async () => {
    const { findAllByText, getByTestId, getByText, queryByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col1');

    await act(async () => {
      fireEvent.click(getByText('Add column'));
    });

    fireEvent.click(getByTestId('delete-Untitled column'));
    expect(api.deleteColumn).not.toHaveBeenCalled();
    expect(queryByTestId('Untitled column')).toBeNull();
  });

  it('should delete column operation should select prev column of deleted column', async () => {
    api.getDataSourceMetaData.mockResolvedValueOnce({
      datasourceMetaData: {
        dataSourceSchema: {
          col1: 'Number',
          col2: 'Number',
          col3: 'Number',
          col4: 'Number',
          col5: 'Number',
          col6: 'Number',
        },
        customColumns: [
          { name: 'col4', expression: '1 + 2' },
          { name: 'col5', expression: '1 + 2' },
          { name: 'col6', expression: '1 + 2' },
        ],
      },
    });

    const { findAllByText, getByTestId, findByTestId } = render(
      <EditDataSouceModelWithProvider open handleClose={jest.fn()} datasourceId="datasourceId" />,
    );
    await findAllByText('col6');
    await findByTestId('col6');

    const col6 = getByTestId('col6');
    fireEvent.click(col6);

    fireEvent.click(getByTestId('delete-col6'));
    await act(async () => {
      fireEvent.click(getByTestId('delete-custom-column'));
    });

    expect(getByTestId('col5').className.includes('makeStyles-selected')).toBeTruthy();
  });
});
