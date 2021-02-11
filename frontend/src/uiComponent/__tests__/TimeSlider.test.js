/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import TimeSlider from '../TimeSlider';

const defaultProps = {
  setTimeSliderValue: jest.fn(),
  dataTestId: 'time-slider',
  title: 'slider title',
  timeSliderValue: 1,
  sliderConfig: {
    strategy: 'stepSize',
    stepSize: 2,
  },
  data: [1, 2, 3, 4, 5],
};
jest.mock('@material-ui/core/Slider', () => (props) => {
  const { min, max, marks, onChange } = props;
  return (
    <div>
      {/* eslint-disable-next-line no-undef */}
      <pre>{mockPropsCapture(props)}</pre>
      <pre data-testid="marks-container">{JSON.stringify(marks)}</pre>
      <input
        defaultValue={min}
        aria-labelledby="Time Slider"
        min={min}
        max={max}
        data-testid="time-slider"
        onChange={(event) => onChange(event, event.target.value)}
      />
    </div>
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
  it('should create marks for all intervals with defaultInterval strategy', () => {
    const updatedConfig = { ...defaultProps, sliderConfig: { strategy: 'defaultIntervals' } };
    const { getByTestId } = render(<TimeSlider {...updatedConfig} />);

    expect(getByTestId('marks-container')).toMatchInlineSnapshot(`
      <pre
        data-testid="marks-container"
      >
        [{"value":1,"label":1},{"value":2},{"value":3},{"value":4},{"value":5,"label":5}]
      </pre>
    `);
  });
  it('should create stepped marks for intervals with stepSize strategy', () => {
    const { getByTestId } = render(<TimeSlider {...defaultProps} />);

    expect(getByTestId('marks-container')).toMatchInlineSnapshot(`
      <pre
        data-testid="marks-container"
      >
        [{"value":1,"label":1},{"value":5,"label":5},{"value":3}]
      </pre>
    `);
  });
  it(
    'should create stepped marks for intervals with stepSize strategy and add last ' +
      'marker even if its not i interval cycle',
    () => {
      const { getByTestId } = render(<TimeSlider {...{ ...defaultProps, data: [1, 2, 3, 4] }} />);

      expect(getByTestId('marks-container')).toMatchInlineSnapshot(`
      <pre
        data-testid="marks-container"
      >
        [{"value":1,"label":1},{"value":4,"label":4},{"value":3}]
      </pre>
    `);
    },
  );
});
