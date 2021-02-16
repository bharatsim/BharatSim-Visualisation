import React from 'react';
import PropTypes from 'prop-types';

import { Box, fade, makeStyles, Typography } from '@material-ui/core';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import ControlledDropDown from '../../uiComponent/ControlledDropdown';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    border: {
      borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
      border: '1px solid',
      borderRadius: theme.spacing(1),
    },
  };
});

function ChartConfigDropdown({
  headers,
  configKey,
  error,
  control,
  label,
  title,
  id,
  border,
  disabled,
}) {
  const classes = useStyles();

  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">{title}</Typography>
      </Box>
      <Box className={`${classes.fieldContainer} ${border ? classes.border : ''}`}>
        <ControlledDropDown
          options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
          id={id}
          label={label}
          error={error}
          control={control}
          name={configKey}
          validations={{ required: 'Required' }}
          disabled={disabled}
          data-testid={id}
        />
      </Box>
    </Box>
  );
}

ChartConfigDropdown.defaultProps = {
  error: {},
  border: true,
  disabled: false,
};

ChartConfigDropdown.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  error: PropTypes.shape({}),
  control: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  border: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ChartConfigDropdown;
