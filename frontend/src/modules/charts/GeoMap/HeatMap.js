import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatMapLayer from '../../../uiComponent/mapLayers/HeatMapLayer';
import 'leaflet/dist/leaflet.css';
import { debounce } from '../../../utils/helper';

// implemented resize using size me, similar as plotly. calling invalidateSize on change of size prop
// because i don't want to pollute onLayoutChange method and existence flow of the configs from dashboard.
// add css class insted of styles.
// not able to write test for HeatMap layer ui component and HeatMap, might need to mock leaflet and componet


function HeatMap({ size }) {
  const [map, setMap] = useState();

  const resize = useCallback(
    debounce(() => {
      map.invalidateSize();
    }, 500),
    [map],
  );

  useEffect(() => {
    if (map) resize();
  }, [size]);

  return (
    <div style={{ height: `100%`, width: `100%` }}>
      <MapContainer
        style={{ height: `100%`, width: `100%` }}
        center={[50.5, 30.5]}
        zoom={13}
        scrollWheelZoom={false}
        whenCreated={(lMap) => setMap(lMap)}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatMapLayer
          points={[
            [50.5, 30.5, 0.2],
            [50.6, 30.4, 0.5],
          ]}
        />
      </MapContainer>
    </div>
  );
}

HeatMap.propTypes = {
  size: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired
}

export default sizeMe({ monitorHeight: true })(React.memo(HeatMap));
