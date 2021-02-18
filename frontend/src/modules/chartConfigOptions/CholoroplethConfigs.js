import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import RadioButtons from '../../uiComponent/RadioButtons';
import ChoroplethMapLayerConfig from './ChoroplethMapLayerConfigs';
import ChoroplethMultiMapLayerConfig from './ChoroplethMultiMapLayerConfig';
import { choroplethTypes } from '../../constants/geoMap';

const choroplethConfigTypes = {
  CHOROPLETH_TYPE: 'choroplethType',
  MAP_LAYER_CONFIG: 'mapLayerConfig',
};

const useStyles = makeStyles({
  radioButtonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

function ChoroplethConfigs({ headers, watch, control, errors, isEditMode, configKey }) {
  const classes = useStyles();
  const choroplethType = watch(`${configKey}.${choroplethConfigTypes.CHOROPLETH_TYPE}`);

  return (
    <Box>
      <Box pl={2} className={classes.radioButtonContainer}>
        <RadioButtons
          defaultValue={choroplethTypes.SINGLE_LEVEL}
          control={control}
          name={`${configKey}.${choroplethConfigTypes.CHOROPLETH_TYPE}`}
          options={[
            { value: choroplethTypes.SINGLE_LEVEL, label: 'Single level' },
            { value: choroplethTypes.DRILL_DOWN, label: 'Multi level Drill down' },
          ]}
          vertical={false}
          disabled={isEditMode}
        />
      </Box>
      {choroplethType === choroplethTypes.DRILL_DOWN ? (
        <ChoroplethMultiMapLayerConfig
          errors={errors[choroplethConfigTypes.MAP_LAYER_CONFIG]}
          isEditMode={isEditMode}
          watch={watch}
          headers={headers}
          configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_CONFIG}`}
          control={control}
        />
      ) : (
        <ChoroplethMapLayerConfig
          control={control}
          isEditMode={isEditMode}
          errors={errors[choroplethConfigTypes.MAP_LAYER_CONFIG][0]}
          configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_CONFIG}.[0]`}
          headers={headers}
          watch={watch}
        />
      )}
    </Box>
  );
}

ChoroplethConfigs.defaultProps = {
  errors: { mapLayerConfig: [] },
  isEditMode: false,
};

ChoroplethConfigs.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  errors: PropTypes.shape({}),
  control: PropTypes.shape({}).isRequired,
  isEditMode: PropTypes.bool,
  watch: PropTypes.func.isRequired,
};

export default ChoroplethConfigs;
