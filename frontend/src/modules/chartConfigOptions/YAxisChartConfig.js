import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, fade, makeStyles, Typography } from '@material-ui/core';

import { useFieldArray, useFormContext } from 'react-hook-form';
import plusIcon from '../../assets/images/plus.svg';
import deleteIcon from '../../assets/images/delete.svg';
import IconButton from '../../uiComponent/IconButton';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import ControlledDropDown from '../../uiComponent/ControlledDropdown';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
      border: '1px solid',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    addMetricButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(4),
    },
  };
});

function YAxisChartConfig({ headers, configKey }) {
  const classes = useStyles();
  const { errors: formErrors, control, isEditMode, setValue } = useFormContext();
  const errors = formErrors[configKey] || [];
  const { fields, remove, append } = useFieldArray({ control, name: configKey });

  useEffect(() => {
    if (!isEditMode) {
      append({ name: '' });
    }
  }, []);

  return (
    <>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">Y-axis</Typography>
      </Box>
      {fields.map((field, index) => (
        <Box className={classes.fieldContainer} key={field.id}>
          <ControlledDropDown
            options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
            id={`y-axis-dropdown-${index}`}
            label="select y axis"
            control={control}
            name={`${configKey}.[${index}].name`}
            validations={{ required: 'Required' }}
            error={errors[index] || {}}
            setValue={setValue}
            defaultValue={field.name}
          />
          <IconButton onClick={() => remove(index)} data-testid={`delete-button-${index}`}>
            <img src={deleteIcon} alt="icon" />
          </IconButton>
        </Box>
      ))}
      <Box className={classes.addMetricButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => append({ name: '' })}
          startIcon={<img src={plusIcon} alt="icon" />}
        >
          Add Metric
        </Button>
      </Box>
    </>
  );
}

YAxisChartConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default YAxisChartConfig;
