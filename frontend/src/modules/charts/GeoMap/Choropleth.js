import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, ScaleControl, TileLayer, ZoomControl } from 'react-leaflet';
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
import { choroplethTypes } from '../../../constants/geoMap';
import DrillDownNavBreadcrumbs from '../../../uiComponent/DrillDownNavBreadcrumbs';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';

const useStyles = makeStyles((theme) => ({
  fullWidthHeight: { height: '100%', width: '100%' },
  mapContainer: {
    height: `calc(100% - ${theme.spacing(11.5)}px )`,
  },
  breadcrumbContainer: {
    position: 'absolute',
    backgroundColor: theme.colors.grayScale['50'],
    zIndex: 100000,
    margin: theme.spacing(2),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0, 2),
  },
}));

const scale = { 0: '#FDF1D9', '0.5': '#FAA847', 1: '#EC3237' };

function Choropleth({ config }) {
  const classes = useStyles();
  const { dataSource, gisMeasure, choroplethConfig, sliderConfig } = config;
  const { choroplethType, mapLayerConfig } = choroplethConfig;
  const timeMetrics = sliderConfig?.timeMetrics;
  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

  const [drillDownLevel, setDrillDownLevel] = useState(0);
  const [featureId, setFeatureId] = useState();
  const [levelFeatureMap, setLevelFeatureMap] = useState({ 0: undefined });
  const [data, setData] = useState();
  const [gisLayer, setGisLayer] = useState();
  const [timeSliderValue, setTimeSliderValue] = useState(1);

  const { mapLayer, mapLayerId, dataLayerId, referenceId } = mapLayerConfig[drillDownLevel];

  const mapLayerConfigDep = useDeepCompareMemoize(mapLayerConfig);
  useEffect(() => {
    setDrillDownLevel(0);
  }, [mapLayerConfigDep]);

  useEffect(() => {
    fetchAllData();
  }, [
    dataLayerId,
    gisMeasure,
    timeMetrics,
    dataLayerId,
    drillDownLevel,
    referenceId,
    mapLayer,
    choroplethConfig,
  ]);

  function onClickOfFeature(event) {
    const selectedFeature = event.target.feature.properties[mapLayerId];
    setFeatureId(selectedFeature);
    setDrillDownLevel((prevDrillDownLevel) => prevDrillDownLevel + 1);
    setLevelFeatureMap((prevMap) => ({ ...prevMap, [drillDownLevel + 1]: selectedFeature }));
  }

  const idMeasureMap = useMemo(
    () =>
      data
        ? transformChoroplethData(
            data[dataLayerId],
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

  const isDrillDown = choroplethType === choroplethTypes.DRILL_DOWN;
  const shouldAddDrillDownCallback =
    choroplethType === choroplethTypes.DRILL_DOWN && drillDownLevel < mapLayerConfig.length - 1;

  const maxValue = data && data[gisMeasure] && Math.max(...data[gisMeasure]);
  const minValue = data && data[gisMeasure] && Math.min(...data[gisMeasure]);

  const breadcrumbsItems = Object.keys(levelFeatureMap)
    .sort()
    .slice(0, drillDownLevel + 1)
    .map((key, index) => {
      return {
        label: `Level ${index + 1}`,
        onClick: () => {
          const levelFeatureId = levelFeatureMap[key];
          setDrillDownLevel(index);
          setFeatureId(levelFeatureId);
        },
      };
    });

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
          <MapContainer
            className={classes.fullWidthHeight}
            zoom={8}
            preferCanvas
            zoomControl={false}
          >
            {isDrillDown && (
              <Box className={classes.breadcrumbContainer}>
                <DrillDownNavBreadcrumbs items={breadcrumbsItems} />
              </Box>
            )}
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJsonLayer
              mapLayer={gisLayer}
              idDataMap={idMeasureMap}
              mapLayerIdName={mapLayerId}
              measureName={gisMeasure}
              scale={scale}
              tick={timeSliderValue}
              onClickOfFeature={shouldAddDrillDownCallback ? onClickOfFeature : null}
              minOfMeasure={minValue}
              maxOfMeasure={maxValue}
            />
            <ResizeController />
            <ScaleControl />
            <ZoomControl position="bottomleft" />
            <ColorScaleLegend
              scale={scale}
              min={minValue}
              max={maxValue}
              title={gisMeasure}
              disablePercentageScale
            />
          </MapContainer>
        </div>
      </LoaderOrError>
    </div>
  );

  async function fetchAllData() {
    startLoader();
    try {
      await fetchGisLayer();
      await fetchAggregatedData();
      stopLoaderAfterSuccess();
    } catch (e) {
      stopLoaderAfterError('Unable to fetch data');
    }
  }

  async function fetchAggregatedData() {
    const { dataLayerId: parentDatalayerId } =
      drillDownLevel > 0 ? mapLayerConfig[drillDownLevel - 1] : {};
    const filter = drillDownLevel > 0 ? { propertyKey: parentDatalayerId, value: featureId } : null;
    const groupBy = [dataLayerId];
    const aggregations = { [gisMeasure]: 'sum' };

    if (timeMetrics) {
      groupBy.push(timeMetrics);
    }

    return api
      .getAggregatedData(dataSource, groupBy, aggregations, filter)
      .then(({ data: fetchedData }) => {
        setData(fetchedData);
      })
      .catch((error) => {
        throw error;
      });
  }

  async function fetchGisLayer() {
    const filter = drillDownLevel > 0 ? { propertyKey: referenceId, value: featureId } : null;
    return api
      .getAggregatedGeoJson(mapLayer, filter)
      .then(({ data: fetchedGisLayer }) => {
        setGisLayer(fetchedGisLayer);
      })
      .catch((error) => {
        throw error;
      });
  }
}

Choropleth.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    gisMeasure: PropTypes.string.isRequired,
    choroplethConfig: PropTypes.shape({
      choroplethType: PropTypes.string,
      mapLayerConfig: PropTypes.arrayOf(
        PropTypes.shape({
          mapLayer: PropTypes.string,
          mapLayerId: PropTypes.string,
          dataLayerId: PropTypes.string,
          referenceId: PropTypes.string,
        }),
      ),
    }).isRequired,
    sliderConfig: PropTypes.shape({
      timeMetrics: PropTypes.string,
      strategy: PropTypes.string,
      stepSize: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default React.memo(Choropleth);
