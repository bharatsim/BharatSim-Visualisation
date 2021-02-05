import React from 'react';
import PropTypes from 'prop-types';
import { useForm as useReactForm } from 'react-hook-form';
import {
  Box,
  Button,
  Tabs,
  Typography,
  Divider,
  Tab,
  makeStyles,
  TextField,
} from '@material-ui/core';

import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
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

function ChartConfigSelectorStep({ existingConfig, chartType, onApply, backToChartType }) {
  const footerClasses = useFooterStyles();
  const [selectedTab] = React.useState(0);
  const classes = useStyles();
  const chartName = existingConfig[CHART_NAME_KEY] || 'Untitled Chart';
  const reactForm = useReactForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    control,
    watch,
    setValue,
    formState,
  } = reactForm;
  const watchShowOtherConfig = watch(DATASOURCE_SELECTOR_KEY, undefined);

  function isEditMode() {
    return Object.keys(existingConfig).length !== 0;
  }

  function onApplyClick(data) {
    onApply(data);
  }

  function resetValue(keys) {
    keys.forEach((key) => setValue(key, undefined));
  }

  return (
    <Box>
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
              id={CHART_NAME_KEY}
              data-testid={CHART_NAME_KEY}
              label="Add chart name"
              variant="filled"
              classes={{ root: classes.textFieldRoot }}
              inputProps={{ name: CHART_NAME_KEY, defaultValue: chartName }}
              inputRef={register({ required: true })}
            />
          </Box>
          <Divider />
          <Box px={2} py={6}>
            <DatasourceSelector
              disabled={isEditMode()}
              control={control}
              name={DATASOURCE_SELECTOR_KEY}
              error={errors[DATASOURCE_SELECTOR_KEY]}
              header="Data Source"
              id="dropdown-dataSources"
              label="select data source"
            />
          </Box>
          {watchShowOtherConfig && (
            <>
              <Divider />
              <Box pt={6}>
                <ConfigSelector
                  dataSourceId={getValues(DATASOURCE_SELECTOR_KEY)}
                  isEditMode={isEditMode()}
                  errors={errors}
                  chartType={chartType}
                  register={register}
                  control={control}
                  watch={watch}
                  resetValue={resetValue}
                />
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
