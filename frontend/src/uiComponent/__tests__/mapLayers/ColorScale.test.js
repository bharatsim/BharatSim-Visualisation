import React from 'react';
import { render } from '@testing-library/react';
import ColorScale from '../../mapLayers/ColorScale';

describe('<ColorScale />', () => {
  const scale = {
    0.0: 'white',
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  };

  it('should match snapshot', () => {
    const { container } = render(<ColorScale scale={scale} title="titleText" />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without 0.0 as scale', () => {
    const { container } = render(
      <ColorScale
        scale={{ 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }}
        title="infected"
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('should create color scale with min max value', () => {
    const { container } = render(
      <ColorScale
        scale={{ 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }}
        title="infected"
        max={300}
        min={100}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should disable percentage scale labels for disablePercentageScale', () => {
    const { container } = render(
      <ColorScale
        scale={{ 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }}
        title="infected"
        max={300}
        min={100}
        disablePercentageScale
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
