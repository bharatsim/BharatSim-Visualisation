import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import Dropdown from '../../uiComponent/Dropdown';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { geoDimensionsField } from '../../constants/geoMap';
import { requiredValueForDropdown } from '../../utils/validators';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      padding: theme.spacing(2),
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
  };
});

function GeoDimensions({ headers, handleConfigChange, configKey, value, handleError }) {
  const classes = useStyles();
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    setErrorForValidationErrors();
  }, [validationError]);

  function setErrorForValidationErrors() {
    const isValidationError = Object.values(geoDimensionsField).some(
      (key) => validationError[key] !== '',
    );
    handleError(configKey, isValidationError ? 'error' : '');
  }

  function handleLatitudeChange(selectedValue) {
    setValidationError({
      ...validationError,
      [geoDimensionsField.LAT]: requiredValueForDropdown(selectedValue),
    });
    handleConfigChange(configKey, { ...value, [geoDimensionsField.LAT]: selectedValue });
  }

  function handleLongitudeChange(selectedValue) {
    setValidationError({
      ...validationError,
      [geoDimensionsField.LON]: requiredValueForDropdown(selectedValue),
    });
    handleConfigChange(configKey, { ...value, [geoDimensionsField.LON]: selectedValue });
  }

  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">Geo Dimension</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <Box>
          <Typography variant="body1">Latitude</Typography>
          <Dropdown
            options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
            onChange={handleLatitudeChange}
            id="latitude"
            key="dropdown-latitude"
            label="select latitude"
            value={value[geoDimensionsField.LAT]}
            error={validationError[geoDimensionsField.LAT]}
          />
        </Box>
        <Box>
          <Typography variant="body1">Longitude</Typography>
          <Dropdown
            options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
            onChange={handleLongitudeChange}
            id="longitude"
            label="select longitude"
            key="dropdown-latitude"
            value={value[geoDimensionsField.LON]}
            error={validationError[geoDimensionsField.LON]}
          />
        </Box>
      </Box>
    </Box>
  );
}

GeoDimensions.defaultProps = {
  value: { [geoDimensionsField.LAT]: '', [geoDimensionsField.LON]: '' },
};

GeoDimensions.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  configKey: PropTypes.string.isRequired,
  value: PropTypes.shape({
    [geoDimensionsField.LAT]: PropTypes.string,
    [geoDimensionsField.LON]: PropTypes.string,
  }),
};

export default GeoDimensions;