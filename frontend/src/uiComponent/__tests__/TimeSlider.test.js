import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import TimeSlider from '../TimeSlider';

const props = {
  defaultValue: 1,
  maxValue: 5,
  step: 1,
  minValue: 1,
  setTimeSliderValue: jest.fn(),
  title: 'title',
  timeSliderValue: 1,
};
jest.mock('@material-ui/core/Slider', () => (props) => {
  const { id, name, min, max, onChange, testid } = props;
  return (
    <input
      data-testid={testid}
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      onChange={(event, val) => onChange(val)}
    />
  );
});
describe('<TimeSlider />', () => {
  it('should match snapshot', () => {
    const { container } = render(<TimeSlider {...props} />);
    expect(container).toMatchSnapshot();
  });
});
