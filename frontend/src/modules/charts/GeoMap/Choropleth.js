import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, ScaleControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@material-ui/core/Box';
import ResizeController from '../../../uiComponent/mapLayers/ResizeController';
import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import GeoJsonLayer from '../../../uiComponent/mapLayers/GeoJsonLayer';
import ColorScaleLegend from '../../../uiComponent/mapLayers/ColorScaleLegend';
import TimeSlider from '../../../uiComponent/TimeSlider';
import tableIcons from '../../../uiComponent/table/tableIcon';

const useStyles = makeStyles((theme) => ({
  fullWidthHeight: { height: '100%', width: '100%' },
  mapContainer: {
    height: `calc(100% - ${theme.spacing(15)}px )`,
  },
}));

function transformData(ids, measure, tick, selectedTick, timeMetrics) {
  const idMeasureMap = {};
  if (timeMetrics) {
    ids.forEach((id, index) => {
      if (tick[index] === selectedTick) {
        idMeasureMap[id] = measure[index];
      }
    });
    return idMeasureMap;
  }
  ids.forEach((id, index) => {
    idMeasureMap[id] = measure[index];
  });
  return idMeasureMap;
}

const scale = { 0: '#FDF1D9', '0.5': '#F7C75C', 1: '#D3501E' };

function Choropleth({ config }) {
  const { dataSource, gisShapeLayer, gisRegionId, gisMeasure, sliderConfig } = config;
  const { timeMetrics } = sliderConfig;
  const [data, setData] = useState();
  const [timeSliderValue, setTimeSliderValue] = useState(1);
  const [gisLayer, setGisLayer] = useState();

  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

  useEffect(() => {
    fetchAllData();
  }, [dataSource, gisShapeLayer, gisRegionId, gisMeasure]);

  async function fetchAllData() {
    startLoader();
    try {
      await fetchData();
      await fetchGisLayer();
      stopLoaderAfterSuccess();
    } catch (e) {
      stopLoaderAfterError('Unable to fetch data');
    }
  }

  async function fetchData() {
    const columns = [gisRegionId, gisMeasure];
    if (timeMetrics) {
      columns.push(timeMetrics);
    }
    return api
      .getData(dataSource, columns)
      .then(({ data: fetchedData }) => {
        setData(fetchedData);
      })
      .catch((error) => {
        throw error;
      });
  }

  async function fetchGisLayer() {
    return api
      .getData(gisShapeLayer)
      .then(({ data: fetchedGisLayer }) => {
        setGisLayer(fetchedGisLayer);
      })
      .catch((error) => {
        throw error;
      });
  }

  const classes = useStyles();

  const idMeasureMap = useMemo(
    () =>
      data
        ? transformData(
            data[gisRegionId],
            data[gisMeasure],
            data[timeMetrics],
            timeSliderValue,
            timeMetrics,
          )
        : {},
    [data, timeSliderValue],
  );

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchAllData,
  };

  return (
    <div className={timeMetrics ? classes.mapContainer : classes.fullWidthHeight}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div className={classes.fullWidthHeight} data-testid="map-container">
          <Box px={4}>
            {timeMetrics && data && data[timeMetrics] && (
              <Box>
                <TimeSlider
                  defaultValue={1}
                  maxValue={Math.max(...data[timeMetrics])}
                  minValue={Math.min(...data[timeMetrics])}
                  step={1}
                  setTimeSliderValue={setTimeSliderValue}
                  title={timeMetrics}
                  timeSliderValue={timeSliderValue}
                />
              </Box>
            )}
          </Box>
          <MapContainer className={classes.fullWidthHeight} zoom={8} preferCanvas>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJsonLayer
              data={gisLayer}
              measure={idMeasureMap}
              idName={gisRegionId}
              measureName={gisMeasure}
              scale={scale}
              tick={timeSliderValue}
            />
            <ResizeController />
            <ScaleControl />
            <ColorScaleLegend scale={scale} />
          </MapContainer>
        </div>
      </LoaderOrError>
    </div>
  );
}

Choropleth.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    gisShapeLayer: PropTypes.string.isRequired,
    gisRegionId: PropTypes.string.isRequired,
    gisMeasure: PropTypes.string.isRequired,
  }).isRequired,
};

export default Choropleth;
