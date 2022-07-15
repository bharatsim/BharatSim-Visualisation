import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import HeatMap from '../HeatMap';
import 'leaflet/dist/leaflet.css';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: {
        lat: [2, 3],
        long: [1, 2],
        dataPoints: [2, 3],
        latNew: [2, 3],
        time: [1, 1],
        time2: [1, 1],
      },
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
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(container).toMatchSnapshot();
  });

it('should not plot point with 0 value', async () => {
    api.getData.mockResolvedValueOnce({data: {
                                               lat: [2, 4,3,5],
                                               long: [1, 5,2,6],
                                               dataPoints: [2,0, 3,0],
                                               latNew: [2, 3],
                                               time: [1, 1],
                                               time2: [1, 1],
                                             }});
    const { container, findByTestId } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: {},
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
          sliderConfig: {},
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should fetch data when rerenderd with different values ', async () => {
    const { findByTestId, rerender } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    rerender(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'latNew', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: {},
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['latNew', 'long', 'dataPoints']);
  });

  it('should call fetch data on click of retry button', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText, findByTestId } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: {},
        }}
      />,
    );

    await findByText('Unable to fetch data');

    const retryButton = getByText('Retry');

    fireEvent.click(retryButton);

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['lat', 'long', 'dataPoints']);
  });
  it('should call fetch data on render with time Metrics if time metric is present', async () => {
    const { findByTestId } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: { timeMetrics: 'time', strategy: 'defaultIntervals' },
        }}
      />,
    );

    await findByTestId('map-container');

    expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['lat', 'long', 'dataPoints', 'time']);
  });
  it('should rerender heatmap on change of config', async () => {
    const { findByTestId, rerender } = render(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'lat', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: { timeMetrics: 'time', strategy: 'defaultIntervals' },
        }}
      />,
    );
    await findByTestId('map-container');
    expect(api.getData).toHaveBeenLastCalledWith('test.csv', ['lat', 'long', 'dataPoints', 'time']);

    rerender(
      <HeatMapWithProvider
        config={{
          dataSource: 'test.csv',
          geoDimensions: { latitude: 'latNew', longitude: 'long' },
          geoMetricSeries: 'dataPoints',
          sliderConfig: { timeMetrics: 'time2', strategy: 'defaultIntervals' },
        }}
      />,
    );
    await findByTestId('map-container');
    expect(api.getData).toHaveBeenLastCalledWith('test.csv', [
      'latNew',
      'long',
      'dataPoints',
      'time2',
    ]);
  });
});
