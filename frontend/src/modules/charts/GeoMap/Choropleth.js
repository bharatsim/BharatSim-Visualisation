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
import { transformChoroplethData } from '../../../utils/helper';

const useStyles = makeStyles((theme) => ({
  fullWidthHeight: { height: '100%', width: '100%' },
  mapContainer: {
    height: `calc(100% - ${theme.spacing(11.5)}px )`,
  },
}));

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
  }, [dataSource, gisShapeLayer, gisRegionId, gisMeasure, timeMetrics]);

  useEffect(() => {
    if (data && data[timeMetrics]) {
      setTimeSliderValue(Math.min(...data[timeMetrics]));
    }
  }, [data]);

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
        ? transformChoroplethData(
            data[gisRegionId],
            data[gisMeasure],
            data[timeMetrics],
            timeSliderValue,
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
                  data={data[timeMetrics]}
                  setTimeSliderValue={setTimeSliderValue}
                  title={timeMetrics}
                  timeSliderValue={timeSliderValue}
                  sliderConfig={sliderConfig}
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
    sliderConfig: PropTypes.shape({
      timeMetrics: PropTypes.string,
      strategy: PropTypes.string,
      stepSize: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default Choropleth;
