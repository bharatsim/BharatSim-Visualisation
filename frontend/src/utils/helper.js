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

function transformDataForHeatMap(data, latitude, longitude, geoMetricSeries) {
  const transformedData = [];
  if (!data) {
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

export {
  updateState,
  transformDataForHeatMap,
  debounce,
  convertStringArrayToOptions,
  convertObjectArrayToOptionStructure,
  convertFileSizeToMB,
};
