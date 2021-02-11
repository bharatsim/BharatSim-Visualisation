import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';

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

function AntSwitch({ onLabel, offLabel, name, control, dataTestid }) {
  const switchContainerClasses = switchContainerStyles();
  const {
    field: { ref, onChange, value },
  } = useController({ name, control, defaultValue: false });

  return (
    <Box className={switchContainerClasses.container}>
      <Box mr={1}>{offLabel}</Box>
      <AntSwitchWithStyle
        inputRef={ref}
        onChange={(e) => onChange(e.target.checked)}
        checked={value}
        data-testid={dataTestid}
      />
      <Box ml={1}>{onLabel}</Box>
    </Box>
  );
}

AntSwitch.propTypes = {
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  dataTestid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
};
export default AntSwitch;
