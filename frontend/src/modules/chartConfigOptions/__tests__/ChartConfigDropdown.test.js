import React from 'react';
import { render } from '@testing-library/react';
import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChartConfigDropdown from '../ChartConfigDropdown';

describe('<ChartConfigDropdown />', () => {
  const ChartConfigDropdownWithTheme = withThemeProvider(ChartConfigDropdown);
  const props = {
    id: 'gis-measure',
    label: 'select measure',
    title: 'GIS Measure',
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    handleConfigChange: jest.fn(),
    configKey: 'gisMeasure',
    error: '',
    value: '',
  };
  it('should match snapshot', () => {
    const { container } = render(<ChartConfigDropdownWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('should call setConfig callback after value change', () => {
    const renderedContainer = render(<ChartConfigDropdownWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'gis-measure', 'a');

    expect(props.handleConfigChange).toHaveBeenCalledWith('gisMeasure', 'a');
  });
});
