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
import { PRECISION } from '../../constants/charts';

function renderToolTip(feature, idDataMap, measureName, mapLayerIdName, sumOfValues) {
  const measureValue = idDataMap[feature.properties[mapLayerIdName]];
  const measureValueInPercentage = ((measureValue / sumOfValues) * 100).toFixed(PRECISION);
  return `
      <div>
         <h5 style='margin:0;text-align: center'>
            ${mapLayerIdName}: ${feature.properties[mapLayerIdName]}
         </h5>
         <span>${measureName}: ${measureValue}</span><br />          
         <span>${measureValueInPercentage}% of total ${measureName}</span>  
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
  minOfMeasure,
  maxOfMeasure,
}) {
  const map = useMap();
  const geoJSONRef = useRef();

  const sumOfValues = Object.values(idDataMap).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const scaleBand = maxOfMeasure - minOfMeasure;

  function onEachFeature(feature, layer) {
    const popupContent = renderToolTip(
      feature,
      idDataMap,
      measureName,
      mapLayerIdName,
      sumOfValues,
    );
    layer.bindTooltip(popupContent);
    layer.on({
      mouseover: highlightOnClick,
      mouseout: resetHighlight(geoJSONRef),
      click: onClickOfFeature || zoomToFeature(map),
    });
  }

  const getGeoJsonStyle = geoJSONStyle(idDataMap, mapLayerIdName, scaleBand, scale, minOfMeasure);
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
  minOfMeasure: PropTypes.number.isRequired,
  maxOfMeasure: PropTypes.number.isRequired,
};

export default GeoJsonLayer;
