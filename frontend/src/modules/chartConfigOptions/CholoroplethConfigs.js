import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormContext } from 'react-hook-form';
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

const emptyFormFieldValue = {
  [choroplethConfigTypes.CHOROPLETH_TYPE]: choroplethTypes.SINGLE_LEVEL,
  [choroplethConfigTypes.MAP_LAYER_CONFIG]: [
    {
      mapLayer: '',
      mapLayerId: '',
      dataLayerId: '',
      referenceId: '',
    },
  ],
};

function ChoroplethConfigs({ headers, configKey }) {
  const classes = useStyles();
  const {
    control,
    watch,
    errors: formErrors,
    isEditMode,
    setValue,
    defaultValues: formDefaultValues,
  } = useFormContext();
  const errors = formErrors[configKey] || { mapLayerConfig: [] };
  const defaultValues = formDefaultValues[configKey] || emptyFormFieldValue;
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
          setValue={setValue}
          defultValues={defaultValues[choroplethConfigTypes.MAP_LAYER_CONFIG]}
        />
      ) : (
        <ChoroplethMapLayerConfig
          control={control}
          isEditMode={isEditMode}
          errors={errors[choroplethConfigTypes.MAP_LAYER_CONFIG][0]}
          configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_CONFIG}.[0]`}
          headers={headers}
          watch={watch}
          defultValues={defaultValues[choroplethConfigTypes.MAP_LAYER_CONFIG][0]}
        />
      )}
    </Box>
  );
}

ChoroplethConfigs.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default ChoroplethConfigs;
