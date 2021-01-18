import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import LegendScale from './ColorScale';

const Legend = ({ scale }) => {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const asd = <LegendScale scale={scale} />;
      ReactDOM.render(asd, div);
      return div;
    };

    legend.addTo(map);

    return () => legend.remove();
  });

  return null;
};

export default Legend;
