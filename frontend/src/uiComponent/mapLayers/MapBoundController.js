import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapBoundController({ layerRef, mapLayer }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(layerRef.current.getBounds());
  }, [mapLayer]);
  return null;
}

export default MapBoundController;
