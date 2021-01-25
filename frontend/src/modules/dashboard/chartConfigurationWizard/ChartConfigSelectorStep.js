import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { Button, Tabs, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import useForm from '../../../hook/useForm';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
import { chartNameValidator, datasourceValidator } from '../../../utils/validators';
import chartConfigs from '../../../config/chartConfigs';
import { createConfigOptionValidationSchema } from '../../../config/chartConfigOptions';
import ButtonGroup from '../../../uiComponent/ButtonGroup';
import { useFooterStyles } from './styles';

const DATASOURCE_SELECTOR_KEY = 'dataSource';
const CHART_NAME_KEY = 'chartName';

const useStyles = makeStyles((theme) => ({
  container: {
    height: `calc(100vh - ${theme.spacing(69)}px)`,
    overflowY: 'scroll',
  },
  tabContainer: {
    padding: theme.spacing(0, 8),
    backgroundColor: theme.colors.primaryColorScale['50'],
    borderStyle: 'solid',
    borderColor: theme.colors.grayScale['200'],
    borderWidth: '1px 0 1px 0',
    margin: theme.spacing(2, -6, 8, -6),
  },
  tabRoot: {
    height: theme.spacing(12),
  },
  textFieldRoot: {
    minWidth: theme.spacing(80),
  },
}));

function ChartConfigSelectorStep({existingConfig, chartType, onApply, backToChartType }) {
  const footerClasses = useFooterStyles();
  const [selectedTab] = React.useState(0);
  const classes = useStyles();
  const chartName =  existingConfig[CHART_NAME_KEY] || 'Untitled Chart'
  const {
    values,
    errors,
    handleInputChange,
    shouldEnableSubmit,
    resetValue,
    handleError,
  } = useForm(
    {
      [CHART_NAME_KEY]: chartName,
      [DATASOURCE_SELECTOR_KEY]: existingConfig[DATASOURCE_SELECTOR_KEY],
      ...fillExistingValues(chartConfigs[chartType].configOptions)
    },
    {
      [CHART_NAME_KEY]: chartNameValidator,
      [DATASOURCE_SELECTOR_KEY]: datasourceValidator,
      ...createConfigOptionValidationSchema(chartConfigs[chartType].configOptions),
    },
  );

  function isEditMode() {
    return Object.keys(existingConfig).length!==0
  }

  function fillExistingValues(options) {
   return options.reduce((existingValues, option)=>({ ...existingValues,[option]: existingConfig[option]}),{})
  }
  function handleDataSourceChange(dataSourceId) {
    handleInputChange(DATASOURCE_SELECTOR_KEY, dataSourceId);
  }

  function handleChartNameChange(event) {
    handleInputChange(CHART_NAME_KEY, event.target.value);
  }

  function onApplyClick() {
    onApply(values);
  }

  function renderBackToChartType() {
      if(isEditMode()) return null;
    return (
      <Button variant="text" size="small" onClick={backToChartType}>
        Back to chart type
      </Button>
    )
  }

  return (
    <Box>
      <Box className={classes.tabContainer}>
        <Tabs value={selectedTab} indicatorColor="primary" aria-label="disabled tabs example">
          <Tab label="Data" classes={{ root: classes.tabRoot }} />
        </Tabs>
      </Box>
      <Box className={classes.container}>
        <Box px={2} pb={6}>
          <Box mb={2}>
            <Typography variant="subtitle2">Chart Name</Typography>
          </Box>
          <TextField
            id={CHART_NAME_KEY}
            data-testid={CHART_NAME_KEY}
            label="Add chart name"
            value={values[CHART_NAME_KEY]}
            onChange={handleChartNameChange}
            variant="filled"
            classes={{ root: classes.textFieldRoot }}
          />
        </Box>
        <Divider />
        <Box px={2} py={6}>
          <DatasourceSelector
            handleDataSourceChange={handleDataSourceChange}
            value={values[DATASOURCE_SELECTOR_KEY]}
            error={errors[DATASOURCE_SELECTOR_KEY]}
            disabled={isEditMode()}
          />
        </Box>
        {values[DATASOURCE_SELECTOR_KEY] && (
          <>
            <Divider />
            <Box pt={6}>
              <ConfigSelector
                dataSourceId={values[DATASOURCE_SELECTOR_KEY]}
                isEditMode={isEditMode()}
                errors={errors}
                handleConfigChange={handleInputChange}
                handleError={handleError}
                chartType={chartType}
                values={values}
                resetValue={resetValue}
              />
            </Box>
          </>
        )}
        <Box className={footerClasses.footer}>
          <Divider />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <ButtonGroup>
              {renderBackToChartType()}
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onApplyClick}
                disabled={!shouldEnableSubmit()}
              >
                Apply
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

ChartConfigSelectorStep.propTypes = {
  existingConfig:  PropTypes.shape({}),
  chartType: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  backToChartType: PropTypes.func.isRequired,
};

ChartConfigSelectorStep.defaultProps = {
  existingConfig: {}
}
export default ChartConfigSelectorStep;
