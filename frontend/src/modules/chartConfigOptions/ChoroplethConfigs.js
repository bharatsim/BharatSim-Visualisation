import React from 'react';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import ChoroplethMapLayerConfig from './ChoroplethMapLayerConfigs';
import ChoroplethMultiMapLayerConfig from './ChoroplethMultiMapLayerConfig';
import { choroplethTypes } from '../../constants/geoMap';
import RadioButtonsField from '../../uiComponent/formField/RadioButtonField';
import { useFormContext } from '../../contexts/FormContext';
import { required } from '../../utils/validators';
import Condition from '../../uiComponent/formField/ConditionalField';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

const choroplethConfigTypes = {
  CHOROPLETH_TYPE: 'choroplethType',
  MAP_LAYER_CONFIG: 'mapLayerConfig',
};

function ChoroplethConfigs({ headers, configKey }) {
  const { isEditMode } = useFormContext();

  return (
    <Box>
      <FieldContainer inline>
        <RadioButtonsField
          name={`${configKey}.${choroplethConfigTypes.CHOROPLETH_TYPE}`}
          options={[
            { value: choroplethTypes.SINGLE_LEVEL, label: 'Single level' },
            { value: choroplethTypes.DRILL_DOWN, label: 'Multi level Drill down' },
          ]}
          vertical={false}
          disabled={isEditMode}
          defaultValue={choroplethTypes.SINGLE_LEVEL}
          validate={required}
        />
      </FieldContainer>
      <Condition
        when={`${configKey}.${choroplethConfigTypes.CHOROPLETH_TYPE}`}
        is={choroplethTypes.DRILL_DOWN}
      >
        <ChoroplethMultiMapLayerConfig
          headers={headers}
          configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_CONFIG}`}
        />
      </Condition>
      <Condition
        when={`${configKey}.${choroplethConfigTypes.CHOROPLETH_TYPE}`}
        is={choroplethTypes.SINGLE_LEVEL}
      >
        <ChoroplethMapLayerConfig
          configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_CONFIG}.[0]`}
          headers={headers}
        />
      </Condition>
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
