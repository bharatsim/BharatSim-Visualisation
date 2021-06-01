import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { getFileExtension } from '../../utils/fileUploadUtils';
import CsvPreview from './CsvPreview';
import JsonPreview from './jsonPreview';
import { EXTENDED_JSON_TYPES } from '../../constants/fileUpload';

function ConfigureDatatype({ selectedFile, previewData, schema }) {
  function getViewerComponent() {
    if (EXTENDED_JSON_TYPES.includes(getFileExtension(selectedFile))) {
      return <JsonPreview selectedFile={selectedFile} previewData={previewData} />;
    }
    if (getFileExtension(selectedFile) === 'csv') {
      return <CsvPreview schema={schema} previewData={previewData} selectedFile={selectedFile} />;
    }
    return `Cannot Preview Data  for ${selectedFile.name}`;
  }

  return <Box>{getViewerComponent()}</Box>;
}

ConfigureDatatype.propTypes = {
  selectedFile: PropTypes.objectOf(File).isRequired,
  previewData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})])
    .isRequired,
  schema: PropTypes.shape({}).isRequired,
};

export default ConfigureDatatype;
