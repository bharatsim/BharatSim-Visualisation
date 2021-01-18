import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, ScaleControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { debounce, getLatLngCenter, transformDataForHeatMap } from '../../../utils/helper';
import ViewLayer from '../../../uiComponent/mapLayers/ViewLayer';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import ColorScaleLegend from '../../../uiComponent/mapLayers/ColorScaleLegend';

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
  const center = getLatLngCenter(locationPoints);
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

  const scale = {
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  };

  return (
    <div className={classes.fullWidthHeight}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div className={classes.fullWidthHeight} data-testid="map-container">
          <MapContainer
            className={classes.fullWidthHeight}
            center={center}
            zoom={8}
            whenCreated={(lMap) => setMap(lMap)}
            preferCanvas
          >
            <ViewLayer center={center} />
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
            />
            <ColorScaleLegend scale={scale} />
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
  }).isRequired,
};

export default HeatMap;
