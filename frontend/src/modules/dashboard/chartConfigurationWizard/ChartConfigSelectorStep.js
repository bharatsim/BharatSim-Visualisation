import React from 'react';
import Box from '@material-ui/core/Box';
import { Button, Tabs } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import useForm from '../../../hook/useForm';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
import { datasourceValidator } from '../../../utils/validators';
import chartConfigs from '../../../config/chartConfigs';
import { createConfigOptionValidationSchema } from '../../../config/chartConfigOptions';
import ButtonGroup from '../../../uiComponent/ButtonGroup';
import { useFooterStyles } from './styles';
import Tab from '@material-ui/core/Tab';

const DATASOURCE_SELECTOR_KEY = 'dataSource';

const useStyles = makeStyles((theme) => ({
  container: {
    height: `calc(100vh - ${theme.spacing(55)}px)`,
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
}));

function ChartConfigSelectorStep({ chartType, onApply, backToChartType }) {
  const footerClasses = useFooterStyles();
  const [selectedTab] = React.useState(0);
  const classes = useStyles();

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
      <Box className={classes.tabContainer}>
        <Tabs value={selectedTab} indicatorColor="primary" aria-label="disabled tabs example">
          <Tab label="Data" classes={{ root: classes.tabRoot }} />
        </Tabs>
      </Box>
      <Box className={classes.container}>
        <Box px={2} pb={6}>
          <DatasourceSelector
            handleDataSourceChange={handleDataSourceChange}
            value={values[DATASOURCE_SELECTOR_KEY]}
            error={errors[DATASOURCE_SELECTOR_KEY]}
          />
        </Box>
        {values[DATASOURCE_SELECTOR_KEY] && (
          <>
            <Divider />
            <Box pt={6}>
              <ConfigSelector
                dataSourceId={values[DATASOURCE_SELECTOR_KEY]}
                errors={errors}
                updateConfigState={handleInputChange}
                chartType={chartType}
                values={values}
              />
            </Box>
          </>
        )}
        <Box className={footerClasses.footer}>
          <Divider />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <ButtonGroup>
              <Button variant="text" size="small" onClick={backToChartType}>
                Back to chart type
              </Button>
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
  chartType: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  backToChartType: PropTypes.func.isRequired,
};

export default ChartConfigSelectorStep;
