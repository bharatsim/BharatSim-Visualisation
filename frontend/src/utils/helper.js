import { INDIA_CENTER } from '../constants/geoMap';

function updateState(prevState, updatedValue) {
  return { ...prevState, ...updatedValue };
}

function convertStringArrayToOptions(stringsArray) {
  return stringsArray.map((stringElement) => ({
    value: stringElement,
    displayName: stringElement,
  }));
}

function convertObjectArrayToOptionStructure(objectArray, displayNameKey, valueKey) {
  return objectArray.map((objectElement) => ({
    value: valueKey ? objectElement[valueKey] : objectElement,
    displayName: objectElement[displayNameKey],
  }));
}

function convertFileSizeToMB(fileSize) {
  const BYTE_TO_MB_CONVERTOR_UNIT = 1024 * 1024;
  return `${(fileSize / BYTE_TO_MB_CONVERTOR_UNIT).toFixed(2)}MB`;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    const context = this;
    const later = () => {
      fn.apply(context, args);
    };
    clearTimeout(timer);
    timer = setTimeout(later, delay);
  };
}

function transformDataForHeatMap(
  data,
  latitude,
  longitude,
  geoMetricSeries,
  timeMetrics,
  selectedStep,
) {
  const transformedData = [];
  if (!data || !data[latitude] || !data[longitude] || !data[geoMetricSeries]) {
    return transformedData;
  }
  if (timeMetrics) {
    data[latitude].forEach((_, index) => {
      if (data[timeMetrics][index] === selectedStep) {
        transformedData.push([
          data[latitude][index],
          data[longitude][index],
          data[geoMetricSeries][index],
        ]);
      }
    });
    return transformedData;
  }

  data[latitude].forEach((_, index) => {
    transformedData.push([
      data[latitude][index],
      data[longitude][index],
      data[geoMetricSeries][index],
    ]);
  });
  return transformedData;
}

function rad2degr(rad) {
  return (rad * 180) / Math.PI;
}

function degr2rad(degr) {
  return (degr * Math.PI) / 180;
}

function getLatLngCenter(latLngInDegr) {
  if (!latLngInDegr || latLngInDegr.length === 0) {
    return INDIA_CENTER;
  }
  const LATIDX = 0;
  const LNGIDX = 1;
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (let i = 0; i < latLngInDegr.length; i += 1) {
    const lat = degr2rad(latLngInDegr[i][LATIDX]);
    const lng = degr2rad(latLngInDegr[i][LNGIDX]);
    sumX += Math.cos(lat) * Math.cos(lng);
    sumY += Math.cos(lat) * Math.sin(lng);
    sumZ += Math.sin(lat);
  }

  const avgX = sumX / latLngInDegr.length;
  const avgY = sumY / latLngInDegr.length;
  const avgZ = sumZ / latLngInDegr.length;

  const lng = Math.atan2(avgY, avgX);
  const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
  const lat = Math.atan2(avgZ, hyp);

  return [rad2degr(lat), rad2degr(lng)];
}

function transformChoroplethDataForTimeSlider(ids, measure, tick, selectedTick) {
  const idMeasureMap = {};
  ids.forEach((id, index) => {
    if (tick[index] === selectedTick) {
      idMeasureMap[id] = measure[index];
    }
  });
  return idMeasureMap;
}

function transformChoroplethData(ids, measure, timeMetrics, selectedTick) {
  if (timeMetrics) {
    return transformChoroplethDataForTimeSlider(ids, measure, timeMetrics, selectedTick);
  }
  const idMeasureMap = {};
  ids.forEach((id, index) => {
    idMeasureMap[id] = measure[index];
  });
  return idMeasureMap;
}

const GISShapeLayerFileTypes = ['geojson', 'topojson', 'json'];

function shapeFileFilter(dataSource) {
  return GISShapeLayerFileTypes.includes(dataSource.fileType);
}

function formatToUnits(number, precision = 0) {
  const abbrev = ['', 'K', 'M', 'B', 'T'];
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3);
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1));
  const suffix = abbrev[order];

  return (number / 10 ** (order * 3)).toFixed(precision) + suffix;
}

export {
  updateState,
  transformDataForHeatMap,
  debounce,
  convertStringArrayToOptions,
  convertObjectArrayToOptionStructure,
  convertFileSizeToMB,
  getLatLngCenter,
  transformChoroplethData,
  shapeFileFilter,
  formatToUnits,
};
