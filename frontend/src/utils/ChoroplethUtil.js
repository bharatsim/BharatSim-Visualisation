import L from 'leaflet';
import chroma from 'chroma-js';

function highlightOnClick(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 2,
    dashArray: '',
    opacity: 1,
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(geoJson) {
  return (e) => geoJson.current.resetStyle(e.target);
}

function zoomToFeature(map) {
  return (e) => map.fitBounds(e.target.getBounds());
}

function geoJSONStyle(idDataMap, mapLayerIdName, maxOfMeasure, scale) {
  const colors = Object.keys(scale)
    .sort((v1, v2) => Number(v1) - Number(v2))
    .map((key) => scale[key]);
  const getColor = chroma.scale(colors);
  return (feature) => {
    const gradientPercentage = idDataMap[feature.properties[mapLayerIdName]] / maxOfMeasure;
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      opacity: 0.7,
      fillColor: getColor(gradientPercentage),
    };
  };
}

export { highlightOnClick, resetHighlight, geoJSONStyle, zoomToFeature };
