import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const switchContainerStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
}));

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
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
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

function AntSwitch({ onChange, onLabel, offLabel, checked, dataTestid }) {
  const switchContainerClasses = switchContainerStyles();
  return (
    <Box className={switchContainerClasses.container}>
      <Box mr={1}>{offLabel}</Box>
      <AntSwitchWithStyle checked={checked} onChange={onChange} data-testid={dataTestid} />
      <Box ml={1}>{onLabel}</Box>
    </Box>
  );
}

AntSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  dataTestid: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};
export default AntSwitch;
