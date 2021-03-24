import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import withThemeProvider from '../../../theme/withThemeProvider';
import ColorPickerField from '../../formField/ColorPickerField';

jest.mock('../../ColorPicker', () => ({ onChange, value, dataTestId }) => <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />);

const TestForm = ({ onSubmit, defaultValue }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <ColorPickerField
          name="colorPicker"
          defaultValue={defaultValue}
        />
        <button type="submit">submit</button>
      </form>
        )}
  />
  );

describe('<ColorPickerField  />', () => {
  const FormForColorPickerField = withThemeProvider(TestForm);

  it('Should return selected value for color picker', () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(<FormForColorPickerField onSubmit={onSubmit} />);

    fireEvent.change(getByTestId('color-picker'), { target: { value: 'color' } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { colorPicker: 'color' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should return default value for color picker', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForColorPickerField onSubmit={onSubmit} />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        colorPicker: {
          a: '1',
          g: '112',
          b: '19',
          r: '241',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should return  default value passed as prop for color picker', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <FormForColorPickerField
        onSubmit={onSubmit}
        defaultValue={{
          a: '112',
          g: '112',
          b: '19',
          r: '241',
        }}
      />,
    );

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        colorPicker: {
          a: '112',
          g: '112',
          b: '19',
          r: '241',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
