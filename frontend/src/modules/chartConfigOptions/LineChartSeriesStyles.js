import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import { Box, Typography } from '@material-ui/core';
import { FieldArray } from 'react-final-form-arrays';
import LineStyleConfig from './LineStyleConfigs';

function LineChartSeriesStyles({ seriesConfigKey, title }) {
  const { getFieldState } = useForm();

  const series = getFieldState(seriesConfigKey)?.value;

  return (
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Box mt={3}>
        {series ? (
          <FieldArray name={seriesConfigKey}>
            {({ fields }) =>
              fields.map((name, index) => (
                <LineStyleConfig
                  name={name}
                  index={index}
                  seriesName={series[index]?.name}
                  key={name}
                />
              ))}
          </FieldArray>
        ) : (
          <Box>
            <Typography variant="subtitle2">Select Y axis measure to add styles</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

LineChartSeriesStyles.propTypes = {
  seriesConfigKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default LineChartSeriesStyles;
