import React from 'react';
import { useForm } from 'react-hook-form';
import { act, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChartConfigDropdown from '../ChartConfigDropdown';

const FormWithChartConfigDropdown = ({ onSubmit }) => {
  const { control, errors, handleSubmit } = useForm({ mode: 'onChange' });
  const props = {
    id: 'gis-measure',
    label: 'select measure',
    title: 'GIS Measure',
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'gisMeasure',
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ChartConfigDropdown {...props} control={control} error={errors[props.configKey]} />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<ChartConfigDropdown />', () => {
  const DemoForm = withThemeProvider(FormWithChartConfigDropdown);
  it('should call setConfig callback after value change', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<DemoForm onSubmit={onSubmit} />);

    selectDropDownOption(renderedContainer, 'gis-measure', 'a');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({ gisMeasure: 'a' }, expect.anything());
  });
});
