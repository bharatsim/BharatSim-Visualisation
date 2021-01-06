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

function debounce(fn, delay){
  let timer = null;
  return (...args) => {
    const context = this;
    const later = () => {
      fn.apply(context, args);
    };
    clearTimeout(timer);
    timer = setTimeout(later, delay);
  };
};


export {
  updateState,
  convertStringArrayToOptions,
  convertObjectArrayToOptionStructure,
  convertFileSizeToMB,
  debounce
};
