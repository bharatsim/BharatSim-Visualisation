import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import useConfigureDatasetStyles from './configureDatasetCSS';

function NoDataSetPresentMessage({ projectMetadataId }) {
  const classes = useConfigureDatasetStyles();
  const uploadFilePage = `/projects/${projectMetadataId}/upload-dataset`;
  return (
    <Box className={classes.noDataSourcesMessage}>
      <Typography variant="subtitle2" color="textPrimary">
        Before we can create any visualization, we ‘ll need some data.
      </Typography>
      <Typography variant="body2">
        Use
        {' '}
        <Link to={uploadFilePage} component={RouterLink}>
          {' '}
          Upload dataset
          {' '}
        </Link>
        to add data files to your dashboard.
      </Typography>
      {' '}
    </Box>
  );
}

NoDataSetPresentMessage.propTypes = {
  projectMetadataId: PropTypes.string.isRequired,
};

export default NoDataSetPresentMessage;
