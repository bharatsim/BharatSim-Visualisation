import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

function HeatMapLayer({ points, options }) {
  const map = useMap();
  useEffect(() => {
    const heatMap = L.heatLayer(points, options).addTo(map);
    return () => map.removeLayer(heatMap);
  });

  return null;
}

HeatMapLayer.defaultProps = {
  options: {
    minOpacity: 0.05,
    maxZoom: 18,
    radius: 25,
    blur: 15,
    max: 1.0,
  },
};

HeatMapLayer.propTypes = {
  points: PropTypes.arrayOf(PropTypes.array).isRequired,
  options: PropTypes.shape({}),
};

export default HeatMapLayer;
