import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

function ViewLayer({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(new L.LatLng(center[0], center[1]));
  }, [center[0], center[1]]);
  return null;
}

export default ViewLayer;
