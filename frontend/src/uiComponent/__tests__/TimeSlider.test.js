/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import TimeSlider from '../TimeSlider';

const defaultProps = {
  defaultValue: 1,
  maxValue: 5,
  step: 1,
  minValue: 1,
  setTimeSliderValue: jest.fn(),
  title: 'title',
  timeSliderValue: 1,
  dataTestId: 'time-slider',
};
jest.mock('@material-ui/core/Slider', () => (props) => {
  const { id, name, min, max, onChange } = props;
  return (
    <input
      data-testid={props['data-testid']}
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      onChange={(event) => onChange(event, event.target.value)}
    />
  );
});
describe('<TimeSlider />', () => {
  it('should match snapshot', () => {
    const { container } = render(<TimeSlider {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should call setTimeSliderValue with current slider value', () => {
    const { getByTestId } = render(<TimeSlider {...defaultProps} />);

    const slider = getByTestId('time-slider');

    fireEvent.change(slider, { target: { value: 2 } });

    expect(defaultProps.setTimeSliderValue).toHaveBeenCalledWith('2');
  });
});
