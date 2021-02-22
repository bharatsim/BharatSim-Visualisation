import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { geoDimensionsField } from '../../constants/geoMap';
import ChartConfigDropdown from './ChartConfigDropdown';

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
  const { errors: formErrors, control } = useFormContext();
  const errors = formErrors[configKey] || {
    [geoDimensionsField.LON]: {},
    [geoDimensionsField.LAT]: {},
  };
  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">Geo Dimension</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <ChartConfigDropdown
          id="latitude"
          key="dropdown-latitude"
          label="select latitude"
          title="Latitude"
          control={control}
          headers={headers}
          configKey={`${configKey}.${geoDimensionsField.LAT}`}
          error={errors[geoDimensionsField.LAT]}
          border={false}
        />
        <ChartConfigDropdown
          id="longitude"
          label="select longitude"
          key="dropdown-longitude"
          title="Longitude"
          control={control}
          headers={headers}
          configKey={`${configKey}.${geoDimensionsField.LON}`}
          error={errors[geoDimensionsField.LON]}
          border={false}
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
