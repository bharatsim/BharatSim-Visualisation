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

function renderToolTip(feature, idDataMap, measureName, mapLayerIdName, maxOfMeasure) {
  const measureValue = idDataMap[feature.properties[mapLayerIdName]];
  const measureValueInPercentile = ((measureValue / maxOfMeasure) * 100).toFixed(2);
  return `
      <div>
         <h5 style='margin:0;text-align: center'>
            ${mapLayerIdName}: ${feature.properties[mapLayerIdName]}
         </h5>
         <span>${measureName}: ${measureValue}</span><br />          
         <span>${measureName} in % of max: ${measureValueInPercentile}%</span>          
      </div>
    `;
}

function GeoJsonLayer({
  mapLayer,
  idDataMap,
  mapLayerIdName,
  measureName,
  scale,
  tick,
  onClickOfFeature,
}) {
  const map = useMap();
  const geoJSONRef = useRef();

  const maxOfMeasure = Math.max(...Object.values(idDataMap));

  function onEachFeature(feature, layer) {
    const popupContent = renderToolTip(
      feature,
      idDataMap,
      measureName,
      mapLayerIdName,
      maxOfMeasure,
    );
    layer.bindTooltip(popupContent);
    layer.on({
      mouseover: highlightOnClick,
      mouseout: resetHighlight(geoJSONRef),
      click: onClickOfFeature || zoomToFeature(map),
    });
  }

  const getGeoJsonStyle = geoJSONStyle(idDataMap, mapLayerIdName, maxOfMeasure, scale);
  return (
    <>
      <GeoJSON
        key={tick}
        data={mapLayer}
        ref={geoJSONRef}
        onEachFeature={onEachFeature}
        style={getGeoJsonStyle}
      />
      <MapBoundController layerRef={geoJSONRef} data={mapLayer} />
    </>
  );
}

GeoJsonLayer.defaultProps = {
  tick: 0,
  onClickOfFeature: null,
};

GeoJsonLayer.propTypes = {
  mapLayer: PropTypes.shape({}).isRequired,
  idDataMap: PropTypes.shape({}).isRequired,
  mapLayerIdName: PropTypes.string.isRequired,
  measureName: PropTypes.string.isRequired,
  scale: PropTypes.shape({}).isRequired,
  tick: PropTypes.number,
  onClickOfFeature: PropTypes.func,
};

export default GeoJsonLayer;
