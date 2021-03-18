import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, fade, makeStyles, Typography } from '@material-ui/core';
import { FieldArray } from 'react-final-form-arrays';
import { useForm } from 'react-final-form';

import deleteIcon from '../../assets/images/delete.svg';
import plusIcon from '../../assets/images/plus.svg';
import IconButton from '../../uiComponent/IconButton';
import { areaAnnotationDirection } from '../../constants/annotations';
import RadioButtonsField from '../../uiComponent/formField/RadioButtonField';
import TextField from '../../uiComponent/formField/TextField';
import SwitchField from '../../uiComponent/formField/SwitchField';
import { useFormContext } from '../../contexts/FormContext';
import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import { required } from '../../utils/validators';

const useStyles = makeStyles((theme) => {
  return {
    configContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
      border: '1px solid',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(4),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    fieldContainer: {
      display: 'flex',
      padding: theme.spacing(2),
      flexDirection: 'column',
    },
    timeFieldContainer: {
      display: 'flex',
      flexDirection: 'row',
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    directionContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    addMetricButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(4),
    },
  };
});

const areaAnnotationConfig = {
  ANNOTATION_TOGGLE: 'annotationToggle',
  START: 'start',
  END: 'end',
  DIRECTION: 'direction',
  ANNOTATION_LABEL: 'label',
  COLOR: 'color',
  OPACITY: 'opacity',
};

const directions = [
  { label: 'X-Axis', value: areaAnnotationDirection.VERTICAL },
  { label: 'Y-Axis', value: areaAnnotationDirection.HORIZONTAL },
];

const defaultDirection = directions[0].value;
const ANNOTATION_NAME = 'annotations';

function AnnotationConfig({ configKey }) {
  const classes = useStyles();
  const { isEditMode } = useFormContext();
  const {
    mutators: { push },
    getFieldState,
  } = useForm();
  const annotationConfigKey = `${configKey}.${ANNOTATION_NAME}`;
  const showAnnotationConfig = getFieldState(
    `${configKey}.${areaAnnotationConfig.ANNOTATION_TOGGLE}`,
  )?.value;

  useEffect(() => {
    if (!isEditMode) push(annotationConfigKey);
  }, []);

  return (
    <Box>
      <Box mb={4} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Annotation</Typography>
        <Box ml={2}>
          <SwitchField
            dataTestId="toggle-time-slider"
            name={`${configKey}.${areaAnnotationConfig.ANNOTATION_TOGGLE}`}
            onLabel="Yes"
            offLabel="No"
            validate={required}
          />
        </Box>
      </Box>
      {showAnnotationConfig && (
        <FieldArray name={annotationConfigKey}>
          {({ fields }) =>
            fields.map((name, index) => (
              <Box className={classes.configContainer} key={name}>
                <Box>
                  <Box className={[classes.fieldContainer, classes.directionContainer].join(' ')}>
                    <Typography variant="subtitle2">Axis</Typography>
                    <Box ml={2}>
                      <RadioButtonsField
                        name={`${name}.${areaAnnotationConfig.DIRECTION}`}
                        options={directions}
                        vertical={false}
                        defaultValue={defaultDirection}
                        validate={required}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Label</Typography>
                    <Box mt={2}>
                      <TextField
                        name={`${name}.${areaAnnotationConfig.ANNOTATION_LABEL}`}
                        label="Enter label"
                        dataTestId="label-input"
                        validate={required}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Position</Typography>
                    <Box className={classes.timeFieldContainer}>
                      <TextField
                        name={`${name}.${areaAnnotationConfig.START}`}
                        label="From value"
                        dataTestId="start-input"
                        validate={required}
                      />
                      <TextField
                        name={`${name}.${areaAnnotationConfig.END}`}
                        label="To Value"
                        dataTestId="end-input"
                        validate={required}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <ColorPickerField
                      name={`${name}.${areaAnnotationConfig.COLOR}`}
                      validate={required}
                      isEditMode={isEditMode}
                    />
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Opacity</Typography>
                    <Box mt={2}>
                      <TextField
                        type="number"
                        name={`${name}.${areaAnnotationConfig.OPACITY}`}
                        label="Enter opacity"
                        dataTestId="opacity-input"
                        inputProps={{ min: 0, max: 1, step: 0.1 }}
                        validate={required}
                        defaultValue={0.1}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box p={2}>
                  <IconButton
                    onClick={() => fields.remove(index)}
                    data-testid={`delete-button-${index}`}
                  >
                    <img src={deleteIcon} alt="icon" />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </FieldArray>
      )}
      <Box className={classes.addMetricButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => push(annotationConfigKey)}
          startIcon={<img src={plusIcon} alt="icon" />}
        >
          Add Annotation
        </Button>
      </Box>
    </Box>
  );
}

AnnotationConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
};

export default AnnotationConfig;
