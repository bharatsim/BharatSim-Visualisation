import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm as useReactForm, FormProvider } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';

import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
import ButtonGroup from '../../../uiComponent/ButtonGroup';
import { useFooterStyles } from './styles';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';

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

function ChartConfigSelectorStep({ existingConfig, chartType, onApply, backToChartType }) {
  const footerClasses = useFooterStyles();
  const [selectedTab] = React.useState(0);
  const classes = useStyles();
  const chartName = existingConfig[chartConfigOptionTypes.CHART_NAME] || 'Untitled Chart';
  const reactForm = useReactForm({ mode: 'onChange', defaultValues: existingConfig });
  const { register, handleSubmit, watch, setValue, formState } = reactForm;
  const [dataSourcesRegistry, setDataSourcesRegistry] = useState({});
  const selectedDatasource = watch(chartConfigOptionTypes.DATASOURCE, undefined);

  function isEditMode() {
    return Object.keys(existingConfig).length !== 0;
  }

  function onApplyClick(data) {
    const datasourceIds = Object.values(dataSourcesRegistry);
    onApply(data, datasourceIds);
  }

  function resetValue(keys) {
    keys.forEach((key) => setValue(key, undefined));
  }

  function registerDatasource(name, datasourceId) {
    setDataSourcesRegistry((prev) => ({ ...prev, [name]: datasourceId }));
  }

  function unRegisterDatasource(name) {
    const currentReg = { ...dataSourcesRegistry };
    delete currentReg[name];
    setDataSourcesRegistry(currentReg);
  }

  const methods = {
    ...reactForm,
    resetValue,
    isEditMode: isEditMode(),
    chartType,
    defaultValues: existingConfig,
    registerDatasource,
    unRegisterDatasource,
  };
  return (
    <Box>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onApplyClick)}>
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
                id={chartConfigOptionTypes.CHART_NAME}
                data-testid={chartConfigOptionTypes.CHART_NAME}
                label="Add chart name"
                variant="filled"
                classes={{ root: classes.textFieldRoot }}
                inputProps={{ name: chartConfigOptionTypes.CHART_NAME, defaultValue: chartName }}
                inputRef={register({ required: true })}
              />
            </Box>
            <Divider />
            <Box px={2} py={6}>
              <DatasourceSelector
                disabled={isEditMode()}
                name={chartConfigOptionTypes.DATASOURCE}
                header="Data Source"
                id="dropdown-dataSources"
                label="select data source"
                defaultValue={existingConfig[chartConfigOptionTypes.DATASOURCE]}
              />
            </Box>
            {selectedDatasource && (
              <>
                <Divider />
                <Box pt={6}>
                  <ConfigSelector />
                </Box>
              </>
            )}
            <Box className={footerClasses.footer}>
              <Divider />
              <Box mt={3} display="flex" justifyContent="flex-end">
                <ButtonGroup>
                  {!isEditMode() && (
                    <Button variant="text" size="small" onClick={backToChartType}>
                      Back to chart type
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={!formState.isValid}
                  >
                    Apply
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

ChartConfigSelectorStep.propTypes = {
  existingConfig: PropTypes.shape({}),
  chartType: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  backToChartType: PropTypes.func.isRequired,
};

ChartConfigSelectorStep.defaultProps = {
  existingConfig: {},
};
export default ChartConfigSelectorStep;
