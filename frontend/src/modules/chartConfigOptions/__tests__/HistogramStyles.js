/* eslint-disable react/prop-types */
import React from 'react';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import HistogramStyleConfig from '../HistogramStyles';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => (
  <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />
));

const TestForm = ({ onSubmit, initialValues }) => {
  const props = {
    seriesConfigKey: 'measure',
    title: 'series',
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <FormProvider>
          <form onSubmit={handleSubmit}>
            <Field name="measure" component="input" />
            <HistogramStyleConfig {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<HistogramStyles />', () => {
  const FormForHistogramStylesConfigDropdown = withThemeProvider(TestForm);
  it('should show message of select y axis to add style', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForHistogramStylesConfigDropdown onSubmit={onSubmit} />);

    expect(getByText('Select measure to add styles')).toBeInTheDocument();
  });

  it('should submit style configs for measure', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <FormForHistogramStylesConfigDropdown
        onSubmit={onSubmit}
        initialValues={{
          measure: 'measure',
        }}
      />,
    );

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        measure: 'measure',
        color: { a: 1, b: 246, g: 201, r: 77 },
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
