import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, ScaleControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@material-ui/core/Box';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { getLatLngCenter, transformDataForHeatMap } from '../../../utils/helper';
import ViewController from '../../../uiComponent/mapLayers/ViewController';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import ColorScaleLegend from '../../../uiComponent/mapLayers/ColorScaleLegend';
import ResizeController from '../../../uiComponent/mapLayers/ResizeController';
import { scale } from '../../../constants/colorScale';
import TimeSlider from '../../../uiComponent/TimeSlider';

const useStyles = makeStyles((theme) => ({
  fullWidthHeight: { height: '100%', width: '100%' },
  mapContainer: {
    height: `calc(100% - ${theme.spacing(15)}px )`,
  },
}));

function HeatMap({ config }) {
  const {
    dataSource,
    geoDimensions: { latitude, longitude },
    geoMetricSeries,
    sliderConfig,
  } = config;
  const { timeMetrics } = sliderConfig;
  const [timeSliderValue, setTimeSliderValue] = useState(2);

  const classes = useStyles();
  const [fetchedData, setFetchedData] = useState();
  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

  useEffect(() => {
    fetchData();
  }, [latitude, longitude, geoMetricSeries, timeMetrics]);

  const locationPoints = useMemo(
    () =>
      transformDataForHeatMap(
        fetchedData,
        latitude,
        longitude,
        geoMetricSeries,
        timeMetrics,
        timeSliderValue,
      ),
    [fetchedData, timeSliderValue],
  );

  const center = getLatLngCenter(locationPoints);

  const maxOfGeoMatrixSeries =
    fetchedData && fetchedData[geoMetricSeries] ? Math.max(...fetchedData[geoMetricSeries]) : 1;

  async function fetchData() {
    const columns = [latitude, longitude, geoMetricSeries];
    if (timeMetrics) {
      columns.push(timeMetrics);
    }
    startLoader();
    return api
      .getData(dataSource, columns)
      .then(({ data }) => {
        stopLoaderAfterSuccess();
        setFetchedData(data);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data');
      });
  }

  useEffect(() => {
    if (fetchedData && fetchedData[timeMetrics]) {
      setTimeSliderValue(Math.min(...fetchedData[timeMetrics]));
    }
  }, [fetchedData]);

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  return (
    <div className={timeMetrics ? classes.mapContainer : classes.fullWidthHeight}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div className={classes.fullWidthHeight} data-testid="map-container">
          <Box px={4}>
            {timeMetrics && fetchedData && fetchedData[timeMetrics] && (
              <Box>
                <TimeSlider
                  defaultValue={Math.min(...fetchedData[timeMetrics])}
                  maxValue={Math.max(...fetchedData[timeMetrics])}
                  minValue={Math.min(...fetchedData[timeMetrics])}
                  step={1}
                  setTimeSliderValue={setTimeSliderValue}
                  title={timeMetrics}
                  timeSliderValue={timeSliderValue}
                />
              </Box>
            )}
          </Box>
          <MapContainer className={classes.fullWidthHeight} center={center} zoom={8} preferCanvas>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatMapLayer
              points={locationPoints}
              options={{
                max: maxOfGeoMatrixSeries,
                radius: 25,
                minOpacity: 0.3,
                gradient: scale,
              }}
              key={timeSliderValue}
            />
            <ColorScaleLegend scale={scale} />
            <ResizeController />
            <ViewController center={center} />
            <ScaleControl />
          </MapContainer>
        </div>
      </LoaderOrError>
    </div>
  );
}

HeatMap.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    geoDimensions: PropTypes.shape({ latitude: PropTypes.string, longitude: PropTypes.string })
      .isRequired,
    geoMetricSeries: PropTypes.string.isRequired,
    sliderConfig: PropTypes.shape({ timeMetrics: PropTypes.string }).isRequired,
  }).isRequired,
};

export default HeatMap;
