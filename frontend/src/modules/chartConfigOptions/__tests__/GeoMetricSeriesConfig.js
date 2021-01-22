import React from 'react';
import { render } from '@testing-library/react';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GeoMetricSeries from '../GeoMetricSeriesConfig';

describe('<GeoMetricSeries />', () => {
  const GeoMetricSeriesConfigWithTheme = withThemeProvider(GeoMetricSeries);
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    handleConfigChange: jest.fn(),
    configKey: 'geoMetricSeries',
    error: '',
    value: '',
  };
  it('should match snapshot', () => {
    const { container } = render(<GeoMetricSeriesConfigWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('should call setConfig callback after value change', () => {
    const renderedContainer = render(<GeoMetricSeriesConfigWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'dropdown-geo-metric-series', 'a');

    expect(props.handleConfigChange).toHaveBeenCalledWith('geoMetricSeries', 'a');
  });
});
