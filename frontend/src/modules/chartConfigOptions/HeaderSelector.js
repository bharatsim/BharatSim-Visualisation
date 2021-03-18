import React from 'react';
import PropTypes from 'prop-types';
import { Box, fade, makeStyles, Typography } from '@material-ui/core';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';

import DropDownField from '../../uiComponent/formField/SelectField';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2, 2),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    border: {
      padding: theme.spacing(2),
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
  validate,
}) {
  const classes = useStyles();

  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" classes={{ caption: classes.caption }}>
          {helperText}
        </Typography>
      </Box>
      <Box className={`${classes.fieldContainer} ${border ? classes.border : ''}`}>
        <DropDownField
          options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
          id={id}
          label={label}
          name={configKey}
          disabled={disabled}
          dataTestid={id}
          validate={validate}
        />
      </Box>
    </Box>
  );
}

HeaderSelector.defaultProps = {
  border: true,
  disabled: false,
  helperText: '',
  validate: null,
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
  border: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.func,
};

export default HeaderSelector;
