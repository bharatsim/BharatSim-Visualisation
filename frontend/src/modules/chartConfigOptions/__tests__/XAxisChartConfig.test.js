import React from 'react';
import { render } from '@testing-library/react';

import XAxisChartConfig from '../XAxisChartConfig';
import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';

describe('<XAxisChartConfig />', () => {
  const XAxisChartConfigWithTheme = withThemeProvider(XAxisChartConfig);
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    handleConfigChange: jest.fn(),
    configKey: 'xAxis',
    error: '',
    value: '',
  };
  it('should match snapshot', () => {
    const { container } = render(<XAxisChartConfigWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('should call setConfig callback after value change', () => {
    const renderedContainer = render(<XAxisChartConfigWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'dropdown-x', 'a');

    expect(props.handleConfigChange).toHaveBeenCalledWith('xAxis', 'a');
  });
});
