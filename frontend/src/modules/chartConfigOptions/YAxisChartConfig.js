import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, fade, makeStyles, Typography } from '@material-ui/core';
import { useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import plusIcon from '../../assets/images/plus.svg';
import deleteIcon from '../../assets/images/delete.svg';
import IconButton from '../../uiComponent/IconButton';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { useFormContext } from '../../contexts/FormContext';
import DropDownField from '../../uiComponent/formField/SelectField';
import { required } from '../../utils/validators';

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
  const { isEditMode } = useFormContext();
  const {
    mutators: { push },
  } = useForm();

  useEffect(() => {
    if (!isEditMode) {
      push(configKey);
    }
  }, []);

  return (
    <>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2">Y-axis</Typography>
      </Box>
      <FieldArray name={configKey}>
        {({ fields }) =>
          fields.map((name, index) => (
            <Box className={classes.fieldContainer} key={name}>
              <DropDownField
                options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
                id={`y-axis-dropdown-${index}`}
                label="select y axis"
                name={`${name}.name`}
                validations={{ required: 'Required' }}
                validate={required}
              />
              <IconButton
                onClick={() => fields.remove(index)}
                data-testid={`delete-button-${index}`}
              >
                <img src={deleteIcon} alt="icon" />
              </IconButton>
            </Box>
          ))}
      </FieldArray>
      <Box className={classes.addMetricButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => push(configKey)}
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
