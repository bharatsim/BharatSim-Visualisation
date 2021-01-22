import { useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { debounce } from '../../utils/helper';

function ResizeController() {
  const map = useMap();

  const resize = useCallback(
    debounce(() => {
      map.invalidateSize();
    }, 500),
    [map],
  );
  resize();
  return null;
}

export default ResizeController;
