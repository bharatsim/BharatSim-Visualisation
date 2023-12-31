import React from 'react';
import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import ViewController from '../../mapLayers/ViewController';

describe('<ViewAndZoomLayer />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
        <MapContainer style={{ height: `100%`, width: `100%` }} zoom={13} scrollWheelZoom={false}>
          <ViewController center={[1, 2]} zoom={12} />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
