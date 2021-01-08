import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { MapContainer, TileLayer } from 'react-leaflet';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import 'leaflet/dist/leaflet.css';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';
import LoaderOrError from '../../loaderOrError/LoaderOrError';

function HeatMap({ config }) {
  const { dataSource, latitude, longitude, geoMetricSeries } = config;
  const [map, setMap] = useState();
  const [fetchedData, setFetchedData] = useState();
  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

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

  function getLocationPoints(data) {
    if (!data) {
      return [];
    }
    return data[longitude].map((long, index) => {
      return [data[latitude][index], long];
    });
  }

  useEffect(() => {
    fetchData();
  }, []);
  if (map) {
    map._onResize = map.invalidateSize();
  }

  const locationPoints = fetchedData ? getLocationPoints(fetchedData) : [];
  return (
    <div style={{ height: `100%`, width: `100%` }}>
      <LoaderOrError loadingState={loadingState} message={message}>
        {locationPoints.length > 0 && (
          <div style={{ height: `100%`, width: `100%` }} data-testid="map-container">
            <MapContainer
              style={{ height: `100%`, width: `100%` }}
              center={locationPoints[0]}
              zoom={13}
              scrollWheelZoom={false}
              whenCreated={(lMap) => setMap(lMap)}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <HeatMapLayer points={locationPoints} />
            </MapContainer>
          </div>
        )}
      </LoaderOrError>
    </div>
  );
}

HeatMap.propTypes = {
  config: PropTypes.shape({}).isRequired,
};

export default HeatMap;
