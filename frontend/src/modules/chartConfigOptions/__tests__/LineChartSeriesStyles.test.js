import React from 'react';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import LineChartSeriesStyles from '../LineChartSeriesStyles';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => (
  <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />
));

const TestForm = ({ onSubmit, initialValues }) => {
  const props = {
    seriesConfigKey: 'yaxis',
    title: 'Series',
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <FormProvider>
          <form onSubmit={handleSubmit}>
            <Field name="yaxis" component="input" />
            <LineChartSeriesStyles {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<LineChartStyles />', () => {
  const FormForLineStyleConfigDropdown = withThemeProvider(TestForm);
  it('should show message of Select y axis to add style', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForLineStyleConfigDropdown onSubmit={onSubmit} />);

    expect(getByText('Select Y axis measure to add styles')).toBeInTheDocument();
  });

  it('should submit style configs for each barchart yaxis measure', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <FormForLineStyleConfigDropdown
        onSubmit={onSubmit}
        initialValues={{
          yaxis: [
            {
              name: 'test1',
            },
            {
              name: 'test2',
            },
          ],
        }}
      />,
    );

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        yaxis: [
          {
            name: 'test1',
            color: {
              a: 1,
              b: 246,
              g: 201,
              r: 77,
            },
            seriesType: 'dot',
            seriesWidth: '1',
          },
          {
            name: 'test2',
            color: {
              a: 1,
              b: 25,
              g: 112,
              r: 246,
            },
            seriesType: 'dot',
            seriesWidth: '1',
          },
        ],
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
