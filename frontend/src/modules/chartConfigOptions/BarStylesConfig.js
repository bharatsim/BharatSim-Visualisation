import React from 'react';
import PropTypes from 'prop-types';
import { Box, fade, makeStyles, Typography } from '@material-ui/core';

import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import { chartColorsPallet } from '../../theme/colorPalette';
import { hexToRgba } from '../../utils/helper';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      alignItems: 'center',
      '& + &': {
        marginTop: theme.spacing(4),
      },
    },
    configContainer: {
      display: 'flex',
      flexDirection: 'column',
      borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
      border: '1px solid',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
      padding: theme.spacing(2),
    },
  };
});

const seriesStyleConfig = {
  COLOR: 'color',
};

function BarStyleConfig({ name, seriesName, index }) {
  const classes = useStyles();
  const defaultColor = hexToRgba(chartColorsPallet[2][index]);
  return (
    <Box className={classes.configContainer}>
      <Box className={classes.fieldContainer}>
        <Typography variant="subtitle2">Series name:&nbsp;</Typography>
        <Typography variant="body1">{seriesName}</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <ColorPickerField name={`${name}.${seriesStyleConfig.COLOR}`} defaultValue={defaultColor} />
      </Box>
    </Box>
  );
}

BarStyleConfig.defaultProps = {
  index: 0,
};

BarStyleConfig.propTypes = {
  name: PropTypes.string.isRequired,
  seriesName: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default BarStyleConfig;
