import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import YAxisChartConfig from '../YAxisChartConfig';

import { FormProvider } from '../../../contexts/FormContext';

const headers = [
  { name: 'a', type: 'number' },
  { name: 'b', type: 'number' },
  { name: 'c', type: 'number' },
];

const TestForm = ({ onSubmit, isEditMode }) => {
  const configKey = 'yAxis';
  const initialValues = {
    yAxis: [{ name: 'b' }, { name: 'c' }],
  };
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={isEditMode ? initialValues : undefined}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <FormProvider
          value={{
            isEditMode: !!isEditMode,
            registerDatasource: jest.fn(),
            unRegisterDatasource: jest.fn(),
          }}
        >
          <form onSubmit={handleSubmit}>
            <YAxisChartConfig configKey={configKey} headers={headers} isEditMode={isEditMode} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<YAxisConfig />', () => {
  const FormForYAxisConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add extra dropbox if form already has one or more yaxis field', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} isEditMode />);
    const { getAllByText } = renderedContainer;
    const yAxisDropdown = getAllByText('select y axis');

    expect(yAxisDropdown.length).toBe(2);
  });

  it('should add dropbox if form has zero yaxis field', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} />);
    const { getAllByText } = renderedContainer;
    const yAxisDropdown = getAllByText('select y axis');

    expect(yAxisDropdown.length).toBe(1);
  });

  it('should call on submit with y axis filedArray config', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} />);
    const { getByText } = renderedContainer;

    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);

    selectDropDownOption(renderedContainer, 'y-axis-dropdown-0', 'a');
    selectDropDownOption(renderedContainer, 'y-axis-dropdown-1', 'b');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        yAxis: [{ name: 'a' }, { name: 'b' }],
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should add y axis field on click of add metric button', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByTestId } = render(<FormForYAxisConfig onSubmit={onSubmit} />);

    const addFieldButton = getByText('Add Metric');

    fireEvent.click(addFieldButton);

    const newField = queryByTestId('y-axis-dropdown-1');

    expect(newField).toBeInTheDocument();
  });

  it('should delete y axis field on click of delete button', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByTestId, getByTestId } = render(
      <FormForYAxisConfig onSubmit={onSubmit} />,
    );

    const addFieldButton = getByText('Add Metric');

    fireEvent.click(addFieldButton);

    const newField = queryByTestId('y-axis-dropdown-1');

    expect(newField).toBeInTheDocument();

    const deleteButton = getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    expect(newField).not.toBeInTheDocument();
  });

  it('should not have delete button if only one yaxis config is present', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} />);
    const { queryAllByAltText } = renderedContainer;

    const deleteIcons = queryAllByAltText('delete-icon');

    expect(deleteIcons.length).toBe(0);
  });
});
