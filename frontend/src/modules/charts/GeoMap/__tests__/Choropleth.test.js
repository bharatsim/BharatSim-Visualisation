import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import 'leaflet/dist/leaflet.css';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';
import Choropleth from '../Choropleth';

const mockGeoJson = {
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

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockImplementation((data) => {
      if (data === 'test.csv')
        return Promise.resolve({ data: { regionId: [1, 2, 3], infected: [2, 4, 6] } });
      return Promise.resolve({ data: mockGeoJson });
    }),
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => (
    <>
      MapContainer
      {children}
    </>
  ),
  TileLayer: () => <>TileLayer</>,
  ScaleControl: () => <>ScaleControl</>,
}));

jest.mock('../../../../uiComponent/mapLayers/HeatMapLayer', () => (props) => (
  <>
    HeatMapLayer
    {JSON.stringify(props)}
  </>
));

jest.mock('../../../../uiComponent/mapLayers/ViewController', () => (props) => (
  <>
    ViewAndZoomLayer
    {JSON.stringify(props)}
  </>
));

jest.mock('../../../../uiComponent/mapLayers/ColorScaleLegend', () => (props) => (
  <>
    ColorScaleLegend
    {JSON.stringify(props)}
  </>
));

jest.mock('../../../../uiComponent/mapLayers/ResizeController', () => (props) => (
  <>
    Resize controller
    {JSON.stringify(props)}
  </>
));

jest.mock('../../../../uiComponent/mapLayers/GeoJsonLayer', () => (props) => (
  <>
    GeoJsonLayer
    {JSON.stringify(props)}
  </>
));

describe('Choropleth', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.runAllTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllMocks();
  });

  const ChoroplethWithProvider = withThemeProvider(Choropleth);

  it('should create a choropleth component', async () => {
    const { container, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(container).toMatchSnapshot();
  });

  it('should show error if get data api fail to load for csv data', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {},
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should call fetch data on render', async () => {
    const { findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenCalledWith('india.geojson');
    expect(api.getData).toHaveBeenCalledWith('test.csv', ['regionId', 'infected']);
  });

  it('should call fetch data on render with time Metrics if time metric is present ', async () => {
    api.getData.mockImplementation((data) => {
      if (data === 'test.csv')
        return Promise.resolve({
          data: { regionId: [1, 2, 3], infected: [2, 4, 6], day: [1, 2, 3] },
        });
      return Promise.resolve({ data: mockGeoJson });
    });

    const { findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {
            timeMetrics: 'day',
          },
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenCalledWith('india.geojson');
    expect(api.getData).toHaveBeenCalledWith('test.csv', ['regionId', 'infected', 'day']);
  });

  it('should rerender when prop value changes', async () => {
    api.getData.mockImplementation((data) => {
      if (data === 'test.csv')
        return Promise.resolve({
          data: {
            regionId: [1, 2, 3],
            infected: [2, 4, 6],
            day: [1, 2, 3],
            regionIdNew: [1, 2, 3],
          },
        });
      return Promise.resolve({ data: mockGeoJson });
    });

    const { findByTestId, rerender } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {
            timeMetrics: 'day',
          },
        }}
      />,
    );

    await findByTestId('map-container');
    expect(api.getData).toHaveBeenCalledWith('test.csv', ['regionId', 'infected', 'day']);

    rerender(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionIdNew',
          gisMeasure: 'infected',
          sliderConfig: {
            timeMetrics: 'day',
          },
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenCalledWith('test.csv', ['regionIdNew', 'infected', 'day']);
  });

  it('should call fetch data on click of retry button', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {},
        }}
      />,
    );

    await findByText('Unable to fetch data');

    const retryButton = getByText('Retry');

    fireEvent.click(retryButton);

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenCalledWith('india.geojson');
    expect(api.getData).toHaveBeenCalledWith('test.csv', ['regionId', 'infected']);
  });

  it('should show error if get data api fail to load for map layer', async () => {
    api.getData.mockImplementation((data) => {
      if (data === 'india.geojson') return Promise.reject('error');
      return Promise.resolve({ data: { regionId: [1, 2, 3], infected: [2, 4, 6] } });
    });
    const { findByText, getByText } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisShapeLayer: 'india.geojson',
          gisRegionId: 'regionId',
          gisMeasure: 'infected',
          sliderConfig: {},
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });
});
