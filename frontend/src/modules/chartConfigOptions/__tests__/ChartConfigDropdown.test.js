import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { act, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChartConfigDropdown from '../ChartConfigDropdown';

const TestForm = ({ onSubmit }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
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
  const methods = { ...form, defaultValues: {} };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ChartConfigDropdown {...props} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<ChartConfigDropdown />', () => {
  const FormForChartConfigDropdown = withThemeProvider(TestForm);
  it('should call setConfig callback after value change', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForChartConfigDropdown onSubmit={onSubmit} />);

    await selectDropDownOption(renderedContainer, 'gis-measure', 'a');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({ gisMeasure: 'a' }, expect.anything());
  });
});
