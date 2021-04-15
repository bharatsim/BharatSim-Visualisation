import React from 'react';
import { useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

import BarStylesConfig from './BarStylesConfig';

function HistogramStyles({ seriesConfigKey, title }) {
  const { getFieldState } = useForm();

  const series = getFieldState(seriesConfigKey)?.value;

  return (
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Box mt={3}>
        {series ? (
          <BarStylesConfig name="" seriesName={series} />
        ) : (
          <Box>
            <Typography variant="subtitle2">Select measure to add styles</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

HistogramStyles.propTypes = {
  seriesConfigKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default HistogramStyles;
