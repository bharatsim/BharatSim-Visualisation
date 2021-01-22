import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, ScaleControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ResizeController from '../../../uiComponent/mapLayers/ResizeController';
import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import GeoJsonLayer from '../../../uiComponent/mapLayers/GeoJsonLayer';
import ColorScaleLegend from '../../../uiComponent/mapLayers/ColorScaleLegend';

const useStyles = makeStyles({
  fullWidthHeight: { height: '100%', width: '100%' },
});

function transformData(ids, measure) {
  const idMeasureMap = {};
  ids.forEach((id, index) => (idMeasureMap[id] = measure[index]));
  return idMeasureMap;
}

const scale = { 0: '#FDF1D9', '0.5': '#F7C75C', 1: '#D3501E' };

function Choropleth({ config }) {
  const { dataSource, gisShapeLayer, gisRegionId, gisMeasure } = config;
  const [data, setData] = useState();
  const [gisLayer, setGisLayer] = useState();

  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    startLoader();
    try {
      await fetchData();
      await fetchGisLayer();
      stopLoaderAfterSuccess();
    } catch (e) {
      stopLoaderAfterError('Unable to fetch data');
    }
  }

  async function fetchData() {
    return api
      .getData(dataSource, [gisRegionId, gisMeasure])
      .then(({ data: fetchedData }) => {
        setData(fetchedData);
      })
      .catch((error) => {
        throw error;
      });
  }

  async function fetchGisLayer() {
    return api
      .getData(gisShapeLayer)
      .then(({ data: fetchedGisLayer }) => {
        setGisLayer(fetchedGisLayer);
      })
      .catch((error) => {
        throw error;
      });
  }

  const classes = useStyles();

  const idMeasureMap = data ? transformData(data[gisRegionId], data[gisMeasure]) : {};

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchAllData,
  };

  return (
    <div className={classes.fullWidthHeight}>
      <LoaderOrError loadingState={loadingState} message={message} errorAction={onErrorAction}>
        <div className={classes.fullWidthHeight} data-testid="map-container">
          <MapContainer className={classes.fullWidthHeight} zoom={8} preferCanvas>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJsonLayer
              data={gisLayer}
              measure={idMeasureMap}
              idName={gisRegionId}
              measureName={gisMeasure}
              scale={scale}
            />
            <ResizeController />
            <ScaleControl />
            <ColorScaleLegend scale={scale} />
          </MapContainer>
        </div>
      </LoaderOrError>
    </div>
  );
}

Choropleth.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    gisShapeLayer: PropTypes.string.isRequired,
    gisRegionId: PropTypes.string.isRequired,
    gisMeasure: PropTypes.string.isRequired,
  }).isRequired,
};

export default Choropleth;
