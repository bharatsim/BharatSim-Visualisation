import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { GeoJSON, useMap } from 'react-leaflet';
import MapBoundController from './MapBoundController';
import {
  geoJSONStyle,
  highlightOnClick,
  resetHighlight,
  zoomToFeature,
} from '../../utils/ChoroplethUtil';

function renderToolTip(feature, idName, measure, measureName, maxOfMeasure) {
  const measureValue = measure[feature.properties[idName]];
  const measureValueInPercentile = ((measureValue / maxOfMeasure) * 100).toFixed(2);
  return `
      <div>
         <h5 style='margin:0;text-align: center'>${idName}: ${feature.properties[idName]}</h5>
         <span>${measureName}: ${measureValue}</span><br />          
         <span>${measureName} in % of max: ${measureValueInPercentile}%</span>          
      </div>
    `;
}

function GeoJsonLayer({ data, measure, idName, measureName, scale }) {
  const map = useMap();
  const geoJSONRef = useRef();

  const maxOfMeasure = Math.max(...Object.values(measure));

  function onEachFeature(feature, layer) {
    const popupContent = renderToolTip(feature, idName, measure, measureName, maxOfMeasure);
    layer.bindTooltip(popupContent);
    layer.on({
      mouseover: highlightOnClick,
      mouseout: resetHighlight(geoJSONRef),
      click: zoomToFeature(map),
    });
  }

  const getGeoJsonStyle = geoJSONStyle(idName, measure, maxOfMeasure, scale);

  return (
    <>
      <GeoJSON data={data} ref={geoJSONRef} onEachFeature={onEachFeature} style={getGeoJsonStyle} />
      <MapBoundController layerRef={geoJSONRef} />
    </>
  );
}

GeoJsonLayer.propTypes = {
  data: PropTypes.shape({}).isRequired,
  measure: PropTypes.shape({}).isRequired,
  idName: PropTypes.string.isRequired,
  measureName: PropTypes.string.isRequired,
  scale: PropTypes.shape({}).isRequired,
};

export default GeoJsonLayer;
