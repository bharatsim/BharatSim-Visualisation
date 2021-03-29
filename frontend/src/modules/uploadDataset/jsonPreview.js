import { Box, Chip, Typography } from '@material-ui/core';
import ReactJson from 'react-json-view';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => {
  return {
    jsonContainer: {
      maxHeight: theme.spacing(86),
      overflow: 'scroll',
    },
    jsonViewer: {
      border: '1px solid',
      borderRadius: theme.spacing(1),
      borderColor: `${theme.colors.primaryColorScale['500']}3D`,
    },
  };
});
const jsonViewerConfig = {
  collapsed: true,
  enableClipboard: false,
};

export default function JsonPreview({ selectedFile, previewData }) {
  const jsonStyle = useStyles();
  return (
    <Box className={jsonStyle.jsonViewer} p={5}>
      <Box display="flex" alignItems="center">
        <Typography variant="body2">DataFile:</Typography>
        <Box pl={2}>
          <Chip variant="outlined" size="small" label={selectedFile.name} color="secondary" />
        </Box>
      </Box>
      <Box m={5} className={jsonStyle.jsonContainer}>
        <ReactJson src={previewData} {...jsonViewerConfig} />
      </Box>
    </Box>
  );
}

JsonPreview.propTypes = {
  selectedFile: PropTypes.objectOf(File).isRequired,
  previewData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})])
    .isRequired,
};
