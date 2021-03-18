import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

const switchContainerStyles = makeStyles({
  container: {
    display: 'flex',
  },
});

const AntSwitchWithStyle = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.colors.primaryColorScale['500'],
        borderColor: theme.colors.primaryColorScale['500'],
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

function SwitchField({ onLabel, offLabel, name, dataTestId, defaultValue, validate }) {
  const switchContainerClasses = switchContainerStyles();

  return (
    <Box className={switchContainerClasses.container}>
      <Box mr={1}>{offLabel}</Box>
      <Field
        type="checkbox"
        name={name}
        validate={validate}
        defaultValue={defaultValue}
        render={({ input }) => {
          return (
            <AntSwitchWithStyle
              onChange={input.onChange}
              checked={input.checked}
              data-testid={dataTestId}
            />
          );
        }}
      />
      <Box ml={1}>{onLabel}</Box>
    </Box>
  );
}
SwitchField.defaultProps = {
  defaultValue: false,
  validate: null,
};

SwitchField.propTypes = {
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  dataTestId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  validate: PropTypes.func,
};
export default SwitchField;
