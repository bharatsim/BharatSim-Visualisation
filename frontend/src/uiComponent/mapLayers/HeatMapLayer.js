import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import "leaflet.heat"

function HeatMapLayer({points}){
  const map = useMap()
  useEffect(() => {
    L.heatLayer(points).addTo(map);
  }, [points]);
  return null;
}

HeatMapLayer.propTypes = {
  points: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default HeatMapLayer;