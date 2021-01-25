import React from 'react';
import { render } from '@testing-library/react';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GeoDimensionsConfig from '../GeoDimensionsConfig';

describe('<GeoDimensionsConfig />', () => {
  const GeoDimensionsWithTheme = withThemeProvider(GeoDimensionsConfig);
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    handleConfigChange: jest.fn(),
    configKey: 'geoDimensions',
    handleError: jest.fn(),
    value: undefined,
  };

  afterEach(()=>{
    jest.clearAllMocks()
  })

  it('should match snapshot', () => {
    const { container } = render(<GeoDimensionsWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('should call handle error with error message if nothing is selected', () => {
    render(<GeoDimensionsWithTheme {...props} />);

    expect(props.handleError).toHaveBeenCalledWith('geoDimensions', 'error');
  });

  it('should not call handle error with error message when values are populated', () => {
    render(<GeoDimensionsWithTheme {...props} value={{ latitude: 'a', longitude: 'b' }} />);

    expect(props.handleError).not.toHaveBeenCalledWith('geoDimensions', 'error');
  });

  it('should call handle error with empty message if all metric are selected', () => {
    const renderedContainer = render(<GeoDimensionsWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'latitude', 'a');

    selectDropDownOption(renderedContainer, 'longitude', 'a');

    expect(props.handleError).toHaveBeenLastCalledWith('geoDimensions', '');
  });

  it('should call setConfig callback after value change for latitude', () => {
    const renderedContainer = render(<GeoDimensionsWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'latitude', 'a');

    expect(props.handleConfigChange).toHaveBeenCalledWith('geoDimensions', {
      latitude: 'a',
      longitude: '',
    });
  });

  it('should call setConfig callback after value change for longitude', () => {
    const renderedContainer = render(<GeoDimensionsWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'longitude', 'a');

    expect(props.handleConfigChange).toHaveBeenCalledWith('geoDimensions', {
      longitude: 'a',
      latitude: '',
    });
  });
});
