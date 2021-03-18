import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';

import { geoDimensionsField } from '../../constants/geoMap';
import HeaderSelector from './HeaderSelector';
import { required } from '../../utils/validators';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
  };
});

function GeoDimensionsConfig({ headers, configKey }) {
  const classes = useStyles();
  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">Geo Dimension</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <HeaderSelector
          id="latitude"
          label="select latitude"
          title="Latitude"
          headers={headers}
          configKey={`${configKey}.${geoDimensionsField.LAT}`}
          border={false}
          validate={required}
        />
        <HeaderSelector
          id="longitude"
          label="select longitude"
          title="Longitude"
          headers={headers}
          configKey={`${configKey}.${geoDimensionsField.LON}`}
          border={false}
          validate={required}
        />
      </Box>
    </Box>
  );
}

GeoDimensionsConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default GeoDimensionsConfig;
