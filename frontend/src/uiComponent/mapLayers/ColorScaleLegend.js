import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import LegendScale from './LegendScale';

const Legend = ({ scale, title, min, max, disablePercentageScale }) => {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const asd = (
        <LegendScale
          scale={scale}
          title={title}
          min={min}
          max={max}
          disablePercentageScale={disablePercentageScale}
        />
      );
      ReactDOM.render(asd, div);
      return div;
    };

    legend.addTo(map);

    return () => legend.remove();
  });

  return null;
};

export default Legend;
