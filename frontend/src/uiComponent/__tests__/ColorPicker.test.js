import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../theme/withThemeProvider';
import ColorPicker from '../ColorPicker';

const ColorPickerWithProvider = withThemeProvider(ColorPicker);
jest.mock('react-color', () => ({
  SketchPicker: ({ color, onChangeComplete }) => {
    const handleChange = () => onChangeComplete({ rgb: { r: 2, g: 3, b: 5, a: 1 } });
    return <input value={color} onChange={handleChange} data-testid="color-picker-input" />;
  },
}));

describe('ColorPicker', () => {
  it('should render color picker on click on color box', () => {
    const onChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <ColorPickerWithProvider onChange={onChange} value={{ r: 1, g: 2, b: 1, a: 1 }} />,
    );

    fireEvent.click(getByTestId('color-picker'));

    const colorPicker = queryByTestId('color-picker-input');

    expect(colorPicker).not.toBeNull();
  });

  it('should call onClick of change of color', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <ColorPickerWithProvider onChange={onChange} value={{ r: 1, g: 2, b: 1, a: 1 }} />,
    );

    fireEvent.click(getByTestId('color-picker'));

    fireEvent.change(getByTestId('color-picker-input'), { target: { value: 'chage' } });

    expect(onChange).toHaveBeenCalledWith({ a: 1, b: 5, g: 3, r: 2 });
  });
});
