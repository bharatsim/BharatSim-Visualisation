import React from 'react';
import { render } from '@testing-library/react';
import ColorScale from '../mapLayers/ColorScale';

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
    const { container } = render(<ColorScale scale={scale} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without 0.0 as scale', () => {
    const { container } = render(
      <ColorScale scale={{ 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }} />,
    );

    expect(container).toMatchSnapshot();
  });
});
