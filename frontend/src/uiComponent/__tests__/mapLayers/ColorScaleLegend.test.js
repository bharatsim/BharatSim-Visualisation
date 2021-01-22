import React from 'react';
import { MapContainer } from 'react-leaflet';
import { render } from '@testing-library/react';
import ColorScaleLegend from '../../mapLayers/ColorScaleLegend';

describe('<ColorScaleLegend />', () => {
  const scale = {
    0.0: 'white',
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  };

  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
        <MapContainer style={{ height: `100%`, width: `100%` }} zoom={13} scrollWheelZoom={false}>
          <ColorScaleLegend scale={scale} />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
