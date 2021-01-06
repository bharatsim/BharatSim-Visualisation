import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import 'leaflet/dist/leaflet.css';
import { debounce } from '../../../utils/helper';
import useLoader from '../../../hook/useLoader';
import { api } from '../../../utils/api';

// implemented resize using size me, similar as plotly. calling invalidateSize on change of size prop
// because i don't want to pollute onLayoutChange method and existence flow of the configs from dashboard.
// add css class insted of styles.
// not able to write test for HeatMap layer ui component and HeatMap, might need to mock leaflet and componet

function HeatMap({ size, config }) {
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
      return [data[latitude][index], long, data[geoMetricSeries][index]];
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const resize = useCallback(
    debounce(() => {
      map.invalidateSize();
    }, 500),
    [map],
  );

  useEffect(() => {
    if (map) resize();
  }, [size]);
  const locationPoints = fetchedData ? getLocationPoints(fetchedData) : [];
  return (
    locationPoints.length > 0 && (
      <div style={{ height: `100%`, width: `100%` }}>
        <MapContainer
          style={{ height: `100%`, width: `100%` }}
          center={locationPoints[0]}
          zoom={13}
          // scrollWheelZoom={false}
          whenCreated={(lMap) => setMap(lMap)}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatMapLayer points={locationPoints} />
        </MapContainer>
      </div>
    )
  );
}

HeatMap.propTypes = {
  size: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
};

export default sizeMe({ monitorHeight: true })(React.memo(HeatMap));
