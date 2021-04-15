import React from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import BarChartSeriesStyles from '../BarChartSeriesStyle';

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
            <BarChartSeriesStyles {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<BarChartStyle />', () => {
  const FormForBarStyleConfigDropdown = withThemeProvider(TestForm);
  it('should show message of select y axis to add style', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForBarStyleConfigDropdown onSubmit={onSubmit} />);

    expect(getByText('Select Y axis measure to add styles')).toBeInTheDocument();
  });

  it('should submit style configs for each barchart yaxis measure', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <FormForBarStyleConfigDropdown
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
          },
          {
            name: 'test2',
            color: {
              a: 1,
              b: 25,
              g: 112,
              r: 246,
            },
          },
        ],
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
