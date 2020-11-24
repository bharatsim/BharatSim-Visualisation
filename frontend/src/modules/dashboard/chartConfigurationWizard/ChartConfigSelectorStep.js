import React from 'react';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import useForm from '../../../hook/useForm';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
import { datasourceValidator } from '../../../utils/validators';
import chartConfigs from '../../../config/chartConfigs';
import { createConfigOptionValidationSchema } from '../../../config/chartConfigOptions';

const DATASOURCE_SELECTOR_KEY = 'dataSource';

function ChartConfigSelectorStep({ chartType, onApply }) {
  const { values, errors, handleInputChange, shouldEnableSubmit } = useForm(
    {},
    {
      [DATASOURCE_SELECTOR_KEY]: datasourceValidator,
      ...createConfigOptionValidationSchema(chartConfigs[chartType].configOptions),
    },
  );

  function handleDataSourceChange(dataSourceId) {
    handleInputChange(DATASOURCE_SELECTOR_KEY, dataSourceId);
  }

  function onApplyClick() {
    onApply(values);
  }

  return (
    <Box>
      <Box px={2} pt={8} pb={6}>
        <DatasourceSelector
          handleDataSourceChange={handleDataSourceChange}
          value={values[DATASOURCE_SELECTOR_KEY]}
          error={errors[DATASOURCE_SELECTOR_KEY]}
        />
      </Box>
      <Divider />
      <Box pt={6}>
        {values[DATASOURCE_SELECTOR_KEY] && (
          <ConfigSelector
            dataSourceId={values[DATASOURCE_SELECTOR_KEY]}
            errors={errors}
            updateConfigState={handleInputChange}
            chartType={chartType}
            values={values}
          />
        )}
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onApplyClick}
          disabled={!shouldEnableSubmit()}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
}

ChartConfigSelectorStep.propTypes = {
  chartType: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default ChartConfigSelectorStep;
