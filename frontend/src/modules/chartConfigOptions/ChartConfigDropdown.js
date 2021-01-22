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

function ChartConfigDropdown({
  headers,
  handleConfigChange,
  configKey,
  error,
  value,
  label,
  title,
  id,
}) {
  const classes = useStyles();
  function handleChange(selectedValue) {
    handleConfigChange(configKey, selectedValue);
  }

  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">{title}</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <Dropdown
          options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
          onChange={handleChange}
          id={id}
          label={label}
          error={error}
          value={value}
        />
      </Box>
    </Box>
  );
}

ChartConfigDropdown.defaultProps = {
  error: '',
  value: '',
};

ChartConfigDropdown.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  configKey: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ChartConfigDropdown;
