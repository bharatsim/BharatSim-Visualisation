import React from 'react';
import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import GeoJsonLayer from '../../mapLayers/GeoJsonLayer';

jest.mock('../../mapLayers/MapBoundController', () => ({ props }) => (
  <div>
    Map bound controller 
    {' '}
    <pre>{JSON.stringify(props)}</pre>
  </div>
));

describe('<ResizeController />', () => {
  const geoJson = {
    type: 'FeatureCollection',
    name: 'Gwalior',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: [
      {
        type: 'Feature',
        properties: {
          AC_NO: 14,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [78.264405697764801, 26.336678009382695],
                [78.274170968215685, 26.336251003181303],
                [78.28502017444157, 26.346887592588359],
              ],
            ],
          ],
        },
      },
    ],
  };
  it('should match snapshot', () => {
    const { container } = render(
      <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
        <MapContainer style={{ height: `100%`, width: `100%` }} zoom={13} scrollWheelZoom={false}>
          <GeoJsonLayer
            data={geoJson}
            measure={{ 14: 22, 15: 123, 45: 13 }}
            idName="AC_NO"
            measureName="intensity"
            scale={{ 0: 'white', 1: 'red' }}
          />
        </MapContainer>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
