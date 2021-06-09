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
    getAggregatedGeoJson: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ data: mockGeoJson })),
    getAggregatedData: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: { regionId: [1, 2, 3], infected: [2, 4, 6], timeTick: [1, 2, 3] },
      }),
    ),
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
  ZoomControl: () => <>ZoomControl</>,
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
    <button
      onClick={() => {
        props.onClickOfFeature({ target: { feature: { properties: { mapLayerId1: 'region1' } } } });
      }}
    >
      feature1
    </button>
    {JSON.stringify(props)}
  </>
));

const config = {
  dataSource: 'test.csv',
  gisMeasure: 'infected',
  choroplethConfig: {
    choroplethType: 'singleLevel',
    mapLayerConfig: [
      {
        mapLayer: 'mapLayer.geoJson',
        mapLayerId: 'mapLayerId1',
        dataLayerId: 'regionId',
        referenceId: '',
      },
    ],
  },
  sliderConfig: {
    timeMetrics: 'timeTick',
    strategy: 'defaultIntervals',
    stepSize: 1,
  },
};

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
          gisMeasure: 'infected',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByTestId('map-container');

    expect(container).toMatchSnapshot();
  });

  it('should create a choropleth component without time slider', async () => {
    const { container, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(container).toMatchSnapshot();
  });

  it('should call fetch data on render with time Metrics if time metric is present with aggregated data', async () => {
    api.getAggregatedData.mockImplementation(() =>
      Promise.resolve({
        data: { regionId: [1, 2, 3], infected: [2, 4, 6], day: [1, 2, 3] },
      }),
    );

    const { findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: { ...config.choroplethConfig, choroplethType: 'drillDown' },
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getAggregatedData).toHaveBeenCalledWith(
      'test.csv',
      ['regionId', 'timeTick'],
      {
        infected: 'sum',
      },
      null,
    );
  });

  it('should show breadcrumbs when drill down map is selected', async () => {
    const { findByTestId, getByText } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: { ...config.choroplethConfig, choroplethType: 'drillDown' },
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByTestId('map-container');

    expect(getByText('Level 1')).toBeInTheDocument();
  });

  it('should show breadcrumbs for Top level and  level 2', async () => {
    api.getAggregatedGeoJson.mockImplementation(() => Promise.resolve({ data: mockGeoJson }));
    api.getAggregatedData.mockImplementation(() =>
      Promise.resolve({
        data: { regionId: [1, 2, 3], infected: [2, 4, 6], regionId2: [1, 2, 3] },
      }),
    );
    const choroplethConfig = {
      choroplethType: 'drillDown',
      mapLayerConfig: [
        {
          mapLayer: 'mapLayer.geoJson',
          mapLayerId: 'mapLayerId1',
          dataLayerId: 'regionId',
          referenceId: '',
        },
        {
          mapLayer: 'mapLayer2.geoJson',
          mapLayerId: 'mapLayerId2',
          dataLayerId: 'regionId2',
          referenceId: 'mapLayerId1',
        },
      ],
    };

    const { getByText, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig,
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    fireEvent.click(getByText('feature1').closest('button'));

    await findByTestId('map-container');

    expect(getByText('Level 1')).toBeInTheDocument();
    expect(getByText('Level 2')).toBeInTheDocument();
  });

  it('should fetch top level data on click of Top level breadcrumb label', async () => {
    api.getAggregatedGeoJson.mockImplementation(() => Promise.resolve({ data: mockGeoJson }));
    api.getAggregatedData.mockImplementation(() =>
      Promise.resolve({
        data: { regionId: [1, 2, 3], infected: [2, 4, 6], regionId2: [1, 2, 3] },
      }),
    );
    const choroplethConfig = {
      choroplethType: 'drillDown',
      mapLayerConfig: [
        {
          mapLayer: 'mapLayer.geoJson',
          mapLayerId: 'mapLayerId1',
          dataLayerId: 'regionId',
          referenceId: '',
        },
        {
          mapLayer: 'mapLayer2.geoJson',
          mapLayerId: 'mapLayerId2',
          dataLayerId: 'regionId2',
          referenceId: 'mapLayerId1',
        },
      ],
    };

    const { getByText, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig,
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    fireEvent.click(getByText('feature1').closest('button'));

    await findByTestId('map-container');
    const topLevelButton = getByText('Level 1').closest('button');
    fireEvent.click(topLevelButton);

    await findByTestId('map-container');

    expect(api.getAggregatedData).toHaveBeenCalledWith(
      'test.csv',
      ['regionId'],
      {
        infected: 'sum',
      },
      null,
    );
    expect(api.getAggregatedGeoJson).toHaveBeenCalledWith('mapLayer.geoJson', null);
  });

  it('should rerender when prop value changes', async () => {
    api.getAggregatedData.mockImplementation(() =>
      Promise.resolve({
        data: {
          regionId: [1, 2, 3],
          infected: [2, 4, 6],
          day: [1, 2, 3],
          infectedNew: [1, 2, 3],
        },
      }),
    );

    const { findByTestId, rerender } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByTestId('map-container');
    expect(api.getAggregatedData).toHaveBeenCalledWith(
      'test.csv',
      ['regionId', 'timeTick'],
      { infected: 'sum' },
      null,
    );

    rerender(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infectedNew',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getAggregatedData).toHaveBeenLastCalledWith(
      'test.csv',
      ['regionId', 'timeTick'],
      { infectedNew: 'sum' },
      null,
    );
  });

  it('should call fetch data on click of retry button', async () => {
    api.getAggregatedData.mockRejectedValueOnce('error');
    const { findByText, getByText, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByText('Unable to fetch data');

    const retryButton = getByText('Retry');

    fireEvent.click(retryButton);

    await findByTestId('map-container');

    expect(api.getAggregatedGeoJson).toHaveBeenCalledWith('mapLayer.geoJson', null);
    expect(api.getAggregatedData).toHaveBeenCalledWith(
      'test.csv',
      ['regionId', 'timeTick'],
      { infected: 'sum' },
      null,
    );
  });

  it('should show error if get data api fail to load for map layer', async () => {
    api.getAggregatedGeoJson.mockImplementation(() => Promise.reject('error'));
    const { findByText, getByText } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: config.choroplethConfig,
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should show error if get data api fail to aggregated data', async () => {
    api.getAggregatedData.mockImplementation(() => Promise.reject('error'));
    api.getAggregatedGeoJson.mockImplementation(() => Promise.resolve({ data: mockGeoJson }));
    const { findByText, getByText } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig: { ...config.choroplethConfig, choroplethType: 'drillDown' },
          sliderConfig: config.sliderConfig,
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should call apis to fetch level2 data and mapLayer on click of feature', async () => {
    api.getAggregatedGeoJson.mockImplementation(() => Promise.resolve({ data: mockGeoJson }));
    api.getAggregatedData.mockImplementation(() =>
      Promise.resolve({
        data: { regionId: [1, 2, 3], infected: [2, 4, 6], regionId2: [1, 2, 3] },
      }),
    );

    const choroplethConfig = {
      choroplethType: 'drillDown',
      mapLayerConfig: [
        {
          mapLayer: 'mapLayer.geoJson',
          mapLayerId: 'mapLayerId1',
          dataLayerId: 'regionId',
          referenceId: '',
        },
        {
          mapLayer: 'mapLayer2.geoJson',
          mapLayerId: 'mapLayerId2',
          dataLayerId: 'regionId2',
          referenceId: 'mapLayerId1',
        },
      ],
    };

    const { getByText, findByTestId } = render(
      <ChoroplethWithProvider
        config={{
          dataSource: 'test.csv',
          gisMeasure: 'infected',
          choroplethConfig,
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getAggregatedData).toHaveBeenCalledWith(
      'test.csv',
      ['regionId'],
      {
        infected: 'sum',
      },
      null,
    );
    expect(api.getAggregatedGeoJson).toHaveBeenCalledWith('mapLayer.geoJson', null);

    fireEvent.click(getByText('feature1').closest('button'));

    await findByTestId('map-container');

    expect(api.getAggregatedData).toHaveBeenLastCalledWith(
      'test.csv',
      ['regionId2'],
      {
        infected: 'sum',
      },
      { propertyKey: 'regionId', value: 'region1' },
    );
    expect(api.getAggregatedGeoJson).toHaveBeenLastCalledWith('mapLayer2.geoJson', {
      propertyKey: 'mapLayerId1',
      value: 'region1',
    });
  });
});
