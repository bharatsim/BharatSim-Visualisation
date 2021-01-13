import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

function ViewAndZoomLayer({ center, zoom }) {
  const mapCenter = center.slice(0, 2);
  const map = useMap();
  useEffect(() => {
    map.setView(new L.LatLng(...mapCenter), zoom);
  }, [center, zoom]);
  return null;
}

export default ViewAndZoomLayer;
