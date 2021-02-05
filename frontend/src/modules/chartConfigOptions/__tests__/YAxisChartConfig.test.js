import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import YAxisChartConfig from '../YAxisChartConfig';

const FormWithYAxisChartConfigConfig = ({ onSubmit }) => {
  const { control, errors, handleSubmit } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'yAxis',
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <YAxisChartConfig
        control={control}
        configKey={props.configKey}
        headers={props.headers}
        errors={errors[props.configKey]}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<YAxisConfig />', () => {
  const DemoForm = withThemeProvider(FormWithYAxisChartConfigConfig);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with y axis filedArray config', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<DemoForm onSubmit={onSubmit} />);
    const { getByText } = renderedContainer;

    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);

    selectDropDownOption(renderedContainer, 'y-axis-dropdown-0', 'a');
    selectDropDownOption(renderedContainer, 'y-axis-dropdown-1', 'b');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        yAxis: [
          { name: 'a', type: 'number' },
          { name: 'b', type: 'number' },
        ],
      },
      expect.anything(),
    );
  });

  it('should add y axis field on click of add metric button', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByTestId } = render(<DemoForm onSubmit={onSubmit} />);

    const addFieldButton = getByText('Add Metric');

    fireEvent.click(addFieldButton);

    const newField = queryByTestId('y-axis-dropdown-1');

    expect(newField).toBeInTheDocument();
  });

  it('should delete y axis field on click of delete button', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByTestId, getByTestId } = render(<DemoForm onSubmit={onSubmit} />);

    const addFieldButton = getByText('Add Metric');

    fireEvent.click(addFieldButton);

    const newField = queryByTestId('y-axis-dropdown-1');

    expect(newField).toBeInTheDocument();

    const deleteButton = getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    expect(newField).not.toBeInTheDocument();
  });
});
