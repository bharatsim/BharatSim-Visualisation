import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import BarStylesConfig from '../BarStylesConfig';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => (
  <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />
));

const TestForm = ({ onSubmit }) => {
  const props = {
    name: 'barStyle',
    seriesName: 'abcd',
    index: 1,
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <FormProvider>
          <form onSubmit={handleSubmit}>
            <BarStylesConfig {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<BarStyle />', () => {
  const FormForBarStyleConfigDropdown = withThemeProvider(TestForm);
  it('should call setConfig callback after value change', () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <FormForBarStyleConfigDropdown onSubmit={onSubmit} />,
    );

    fireEvent.change(getByTestId('color-picker'), {
      target: { value: 'color' },
    });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { barStyle: { color: 'color' } },
      expect.anything(),
      expect.anything(),
    );
  });
});
