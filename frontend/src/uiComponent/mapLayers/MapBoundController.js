import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapBoundController({ layerRef }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(layerRef.current.getBounds());
  }, []);
  return null;
}

export default MapBoundController;
