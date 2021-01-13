import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import 'leaflet/dist/leaflet.css';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { INDIA_CENTER } from '../../../constants/geoMap';
import { debounce, transformDataForHeatMap } from '../../../utils/helper';
import ViewAndZoomLayer from '../../../uiComponent/mapLayers/ViewAndZoomLayer';

const useStyles = makeStyles({
  fullWidthHeight: { height: '100%', width: '100%' },
});

function HeatMap({ config }) {
  const {
    dataSource,
    geoDimensions: { latitude, longitude },
    geoMetricSeries,
  } = config;

  const classes = useStyles();
  const [map, setMap] = useState();
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
  }, []);

  const resize = useCallback(
    debounce(() => {
      map.invalidateSize();
    }, 500),
    [map],
  );

  const locationPoints = transformDataForHeatMap(fetchedData, latitude, longitude, geoMetricSeries);

  if (map) {
    resize();
  }

  const maxOfGeoMatrixSeries = fetchedData ? Math.max(...fetchedData[geoMetricSeries]) : 1;

  async function fetchData() {
    startLoader();
    return api
      .getData(dataSource, [latitude, longitude, geoMetricSeries])
      .then(({ data }) => {
        stopLoaderAfterSuccess();
        setFetchedData(data);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data');
      });
  }

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  return (
    <div className={classes.fullWidthHeight}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div className={classes.fullWidthHeight} data-testid="map-container">
          <MapContainer
            className={classes.fullWidthHeight}
            center={locationPoints[0] || INDIA_CENTER}
            zoom={4}
            whenCreated={(lMap) => setMap(lMap)}
          >
            <ViewAndZoomLayer center={locationPoints[0] || INDIA_CENTER} zoom={4} />
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatMapLayer
              points={locationPoints}
              options={{ max: maxOfGeoMatrixSeries, radius: 75 }}
            />
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
  }).isRequired,
};

export default HeatMap;
