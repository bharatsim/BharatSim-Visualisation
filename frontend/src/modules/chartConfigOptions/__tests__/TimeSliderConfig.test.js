import { render } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import TimeSliderConfig from '../TimeSliderConfig';
import withThemeProvider from '../../../theme/withThemeProvider';
import { selectDropDownOption } from '../../../testUtil';

const props = {
  headers: [
    { name: 'col1', type: 'number' },
    { name: 'col2', type: 'number' },
  ],
  handleConfigChange: jest.fn(),
  configKey: 'sliderConfig',
  value: { timeMetrics: '' },
  handleError: jest.fn(),
};
describe('<TimeSliderConfig/>', () => {
  const TimeSliderConfigWithThemeProvider = withThemeProvider(TimeSliderConfig);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot when toggle is off', () => {
    const { container } = render(<TimeSliderConfigWithThemeProvider {...props} />);

    expect(container).toMatchSnapshot();
  });
  it('should match snapshot when toggle is on', () => {
    const { container, getByRole } = render(<TimeSliderConfigWithThemeProvider {...props} />);
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });
    expect(container).toMatchSnapshot();
  });
  it('should change the time metrics column on change of input', () => {
    const renderedContainer = render(<TimeSliderConfigWithThemeProvider {...props} />);
    const { getByRole } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'timeMetrics', 'col2');

    expect(props.handleConfigChange).toHaveBeenCalledWith('sliderConfig', {
      timeMetrics: 'col2',
    });
  });
  it('should show validation error if any while changing the value', () => {
    const renderedContainer = render(<TimeSliderConfigWithThemeProvider {...props} />);
    const { getByRole } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    expect(props.handleError).toHaveBeenCalledWith('sliderConfig', 'error');
  });

  it('should call handle error with empty message if all metric are selected', () => {
    const renderedContainer = render(<TimeSliderConfigWithThemeProvider {...props} />);
    const { getByRole } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'timeMetrics', 'col2');

    expect(props.handleError).toHaveBeenLastCalledWith('sliderConfig', '');
  });
});
