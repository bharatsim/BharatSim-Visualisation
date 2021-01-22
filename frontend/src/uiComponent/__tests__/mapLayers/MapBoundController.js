import React from 'react';
import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import MapBoundController from '../../mapLayers/MapBoundController';

describe('<MapBoundController />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
        <MapContainer style={{ height: `100%`, width: `100%` }} zoom={13} scrollWheelZoom={false}>
          <MapBoundController
            layerRef={{
              current: {
                getBounds: jest.fn().mockReturnValue([
                  [40.712, -74.227],
                  [40.774, -74.125],
                ]),
              },
            }}
          />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
