import React from 'react';
import { useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

import BarStylesConfig from './BarStylesConfig';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

function HistogramStyles({ seriesConfigKey, title }) {
  const { getFieldState } = useForm();

  const series = getFieldState(seriesConfigKey)?.value;

  return (
    <FieldsContainer title={title}>
      {series ? (
        <BarStylesConfig name="" seriesName={series} />
      ) : (
        <Box textAlign="center">
          <Typography variant="subtitle2" align="center">
            Select measure to add styles
          </Typography>
        </Box>
      )}
    </FieldsContainer>
  );
}

HistogramStyles.propTypes = {
  seriesConfigKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default HistogramStyles;
