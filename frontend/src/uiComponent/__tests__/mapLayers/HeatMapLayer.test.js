import React from 'react';
import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import HeatMapLayer from '../../mapLayers/HeatMapLayer';

describe('<HeatMapLayer />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          style={{ height: '500px', width: '100%' }}
          center={[50.5, 30.5]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <HeatMapLayer
            points={[
              [50.5, 30.5, 0.2],
              [50.6, 30.4, 0.5],
            ]}
          />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
