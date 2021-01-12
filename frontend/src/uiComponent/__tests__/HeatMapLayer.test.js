import React from 'react';
import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import HeatMapLayer from '../mapLayers/HeatMapLayer';

describe('<HeatMapLayer />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
        <MapContainer style={{ height: `100%`, width: `100%` }} zoom={13} scrollWheelZoom={false}>
          <HeatMapLayer
            points={[
              [1, 2, 0.1],
              [1, 3, 0.1],
            ]}
          />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
