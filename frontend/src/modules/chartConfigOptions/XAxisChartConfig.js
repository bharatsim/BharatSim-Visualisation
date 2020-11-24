import React from 'react';
import PropTypes from 'prop-types';

import { Box, fade, makeStyles, Typography } from '@material-ui/core';
import Dropdown from '../../uiComponent/Dropdown';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
      border: '1px solid',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
    },
  };
});

function XAxisChartConfig({ headers, updateConfigState, configKey, error, value }) {
  const classes = useStyles();
  function handleXChange(selectedValue) {
    updateConfigState(configKey, selectedValue);
  }

  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2"> X-axis</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <Dropdown
          options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
          onChange={handleXChange}
          id="dropdown-x"
          label="select x axis"
          error={error}
          value={value}
        />
      </Box>
    </Box>
  );
}

XAxisChartConfig.defaultProps = {
  error: '',
  value: '',
};

XAxisChartConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateConfigState: PropTypes.func.isRequired,
  configKey: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
};

export default XAxisChartConfig;
