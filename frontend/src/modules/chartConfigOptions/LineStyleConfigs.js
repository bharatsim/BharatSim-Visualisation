import React from 'react';
import { Box, fade, InputAdornment, makeStyles, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';
import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import SelectField from '../../uiComponent/formField/SelectField';
import TextField from '../../uiComponent/formField/TextField';
import { hexToRgba } from '../../utils/helper';
import { chartColorsPallet } from '../../theme/colorPalette';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      alignItems: 'center',
      '& + &': {
        marginTop: theme.spacing(4),
      },
    },
    verticalFieldContainer: {
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
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
  SERIES_TYPE: 'seriesType',
  SERIES_WIDTH: 'seriesWidth',
};

const seriesTypeOptions = [
  { value: 'solid', displayName: 'Solid' },
  { value: 'dot', displayName: 'Dot' },
  { value: 'dash', displayName: 'Dash' },
  { value: 'longdash', displayName: 'Long Dash' },
  { value: 'dashdot', displayName: 'Dash Dot' },
  { value: 'longdashdot', displayName: 'Long Dash Dot' },
];

function LineStyleConfig({ name, seriesName, index }) {
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
      <Box className={`${classes.fieldContainer} ${classes.verticalFieldContainer}`}>
        <Typography variant="subtitle2">Line Style</Typography>
        <SelectField
          label="select line type"
          name={`${name}.${seriesStyleConfig.SERIES_TYPE}`}
          options={seriesTypeOptions}
          id="series-type"
          defaultValue="dot"
        />
      </Box>
      <Box className={`${classes.fieldContainer} ${classes.verticalFieldContainer}`}>
        <Typography variant="subtitle2">Line Thickness</Typography>
        <TextField
          name={`${name}.${seriesStyleConfig.SERIES_WIDTH}`}
          dataTestId="series-width"
          type="number"
          label="enter line thickness"
          defaultValue="1"
          InputProps={{ endAdornment: <InputAdornment position="end">Px</InputAdornment> }}
        />
      </Box>
    </Box>
  );
}

LineStyleConfig.defaultProps = {
  index: 0,
};

LineStyleConfig.propTypes = {
  name: PropTypes.string.isRequired,
  seriesName: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default LineStyleConfig;
