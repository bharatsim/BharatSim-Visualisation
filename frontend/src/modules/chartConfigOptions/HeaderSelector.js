import React from 'react';
import PropTypes from 'prop-types';
import { Box, fade, makeStyles, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

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
    caption: {
      color: theme.palette.text.secondary,
    },
  };
});

function HeaderSelector({
  headers,
  configKey,
  label,
  title,
  id,
  border,
  disabled,
  helperText,
  defaultValue,
}) {
  const classes = useStyles();
  const { errors, control, setValue, defaultValues } = useFormContext();
  const error = errors[configKey] || {};
  const initialValue = defaultValue || defaultValues[configKey] || '';
  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" classes={{ caption: classes.caption }}>
          {helperText}
        </Typography>
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
          setValue={setValue}
          defaultValue={initialValue}
        />
      </Box>
    </Box>
  );
}

HeaderSelector.defaultProps = {
  border: true,
  disabled: false,
  helperText: '',
  defaultValue: '',
};

HeaderSelector.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  border: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
};

export default HeaderSelector;