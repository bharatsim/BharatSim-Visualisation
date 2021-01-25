import React from 'react';
import {fireEvent} from '@testing-library/dom';
import {render} from '@testing-library/react';
import HeatMap from '../HeatMap';
import 'leaflet/dist/leaflet.css';
import {api} from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { lat: [2, 3], long: [1, 2], dataPoints: [2, 3] },
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

describe('HeatMap', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.runAllTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  const HeatMapWithProvider = withThemeProvider(HeatMap);

  it('should create a heatmap component', async () => {
    const { container, findByTestId } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
        }}
      />,
    );

    await findByTestId('map-container');

    expect(container).toMatchSnapshot();
  });

  it('should show error if api fail to load', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

    it('should fetch data when rerenderd with different values ', () => {
        const config = {
            dataSource: 'test.csv',
            geoDimensions: {latitude: 'lat', longitude: 'long'},
            geoMetricSeries: 'dataPoints'
        };
        const configWithNewLat = {...config, geoDimensions: {latitude: 'newLat', longitude: 'long'}};
        const configWithNewLong = {...config, geoDimensions: {latitude: 'lat', longitude: 'newLong'}};
        const configWithNewSeries = {...config, geoMetricSeries: 'newDataPoint'};

        [configWithNewLat, configWithNewLong, configWithNewSeries].forEach((updateConfig) => {
            jest.clearAllMocks();

            const {rerender} = render(
              <HeatMapWithProvider
                config={config}
              />,
            );
            expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['lat', 'long', 'dataPoints']);

            rerender(<HeatMapWithProvider
              config={updateConfig}
            />)


            const {latitude, longitude} = updateConfig.geoDimensions
            expect(api.getData).toHaveBeenLastCalledWith('test.csv', [latitude, longitude, updateConfig.geoMetricSeries]);

        })

    });

  it('should call fetch data on click of retry button', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText, findByTestId } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
        }}
      />,
    );

    await findByText('Unable to fetch data');

    const retryButton = getByText('Retry');

    fireEvent.click(retryButton);

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['lat', 'long', 'dataPoints']);
  });
});
