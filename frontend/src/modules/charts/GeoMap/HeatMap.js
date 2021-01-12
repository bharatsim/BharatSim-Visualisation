import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { MapContainer, TileLayer } from 'react-leaflet';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import 'leaflet/dist/leaflet.css';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { INDIA_CENTER } from '../../../constants/geoMap';

function transformDataForHeatMap(data, latitude, longitude, geoMetricSeries) {
  const transformedData = [];
  if (!data) {
    return transformedData;
  }
  data[latitude].forEach((_, index) => {
    transformedData.push([
      data[latitude][index],
      data[longitude][index],
      data[geoMetricSeries][index],
    ]);
  });
  return transformedData;
}

function HeatMap({ config }) {
  const {
    dataSource,
    geoDimensions: { latitude, longitude },
    geoMetricSeries,
  } = config;

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

  const locationPoints = transformDataForHeatMap(fetchedData, latitude, longitude, geoMetricSeries);

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

  if (map) {
    map.invalidateSize();
  }

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  return (
    <div style={{ height: `100%`, width: `100%` }}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
          <MapContainer
            style={{ height: `100%`, width: `100%` }}
            center={locationPoints[0] || INDIA_CENTER}
            zoom={13}
            whenCreated={(lMap) => setMap(lMap)}
          >
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
