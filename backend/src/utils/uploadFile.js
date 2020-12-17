function getFileExtension(fileName) {
  const splitted = fileName.split('.');
  return splitted[splitted.length - 1];
}

module.exports = { getFileExtension };
