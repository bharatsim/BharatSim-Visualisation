import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import ControlledDropDown from '../../uiComponent/ControlledDropdown';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      padding: theme.spacing(2),
      display: 'flex',
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
  };
});

const xAxisConfigNames = {
  TYPE: 'type',
  NAME: 'columnName',
};

const axisTypeOptions = [
  { value: '-', displayName: 'Default' },
  { value: 'date', displayName: 'Date' },
  { value: 'category', displayName: 'Category' },
  { value: 'linear', displayName: 'Linear' },
  { value: 'log', displayName: 'Log' },
];

function XAxisConfig({ headers, configKey }) {
  const classes = useStyles();
  const {
    errors: formErrors,
    control,
    defaultValues: formDefaultValues,
    setValue,
    watch,
  } = useFormContext();
  const errors = formErrors[configKey] || {};
  const defaultValues = formDefaultValues[configKey] || { [xAxisConfigNames.TYPE]: '-' };
  const selectedType = watch(`${configKey}.${xAxisConfigNames.TYPE}`);
  return (
    <Box>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">X axis</Typography>
      </Box>
      <Box className={classes.fieldContainer}>
        <ControlledDropDown
          id="x-axis-dropdown"
          key="dropdown-x-axis"
          label="select x axis"
          title="x axis"
          control={control}
          options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
          name={`${configKey}.${xAxisConfigNames.NAME}`}
          error={errors[xAxisConfigNames.NAME]}
          defaultValue={defaultValues[xAxisConfigNames.NAME]}
          border={false}
          setValue={setValue}
        />
        <ControlledDropDown
          id="x-axis-type-dropdown"
          label="select x axis type"
          key="dropdown-x-axis-type"
          title="x axis type"
          control={control}
          options={axisTypeOptions}
          name={`${configKey}.${xAxisConfigNames.TYPE}`}
          error={errors[xAxisConfigNames.TYPE]}
          defaultValue={defaultValues[xAxisConfigNames.TYPE]}
          border={false}
          setValue={setValue}
          helperText={
            selectedType === 'date' ? 'Only YYYY-mm-dd HH:MM:SS.sss date format is supported' : ''
          }
        />
      </Box>
    </Box>
  );
}

XAxisConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default XAxisConfig;
