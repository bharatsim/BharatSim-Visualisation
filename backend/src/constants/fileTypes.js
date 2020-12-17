const fileTypes = {
  CSV: 'csv',
  JSON: 'json',
  GEOJSON: 'geojson',
  TOPOJSON: 'topojson',
};

const EXTENDED_JSON_TYPES = ['geojson', 'topojson'];

const MAX_FILE_SIZE = 314572800;

module.exports = { fileTypes, MAX_FILE_SIZE, EXTENDED_JSON_TYPES };
