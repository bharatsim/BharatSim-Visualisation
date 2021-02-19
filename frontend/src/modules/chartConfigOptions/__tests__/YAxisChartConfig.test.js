import React, { useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import YAxisChartConfig from '../YAxisChartConfig';

const headers = [
  { name: 'a', type: 'number' },
  { name: 'b', type: 'number' },
  { name: 'c', type: 'number' },
];

const TestForm = ({ onSubmit, isEditMode }) => {
  const { control, errors, handleSubmit, reset } = useForm({ mode: 'onChange' });

  const configKey = 'yAxis';

  useEffect(() => {
    if (isEditMode) {
      reset({
        yAxis: [{ name: 'b' }, { name: 'c' }],
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <YAxisChartConfig
        control={control}
        configKey={configKey}
        headers={headers}
        errors={errors[configKey]}
        isEditMode={isEditMode}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<YAxisConfig />', () => {
  const FormForYAxisConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add extra dropbox if form is in edit mode', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} isEditMode />);
    const { getAllByText } = renderedContainer;
    const yAxisDropdown = getAllByText('select y axis');

    expect(yAxisDropdown.length).toBe(2);
  });

  it('should call on submit with y axis filedArray config', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForYAxisConfig onSubmit={onSubmit} />);
    const { getByText } = renderedContainer;

    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);

    await selectDropDownOption(renderedContainer, 'y-axis-dropdown-0', 'a');
    await selectDropDownOption(renderedContainer, 'y-axis-dropdown-1', 'b');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        yAxis: [{ name: 'a' }, { name: 'b' }],
      },
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
});
