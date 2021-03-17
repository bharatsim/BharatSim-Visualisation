import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, fade, makeStyles, Typography } from '@material-ui/core';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import AntSwitch from '../../uiComponent/AntSwitch';
import UncontrolledInputField from '../../uiComponent/UncontrolledInputField';
import RadioButtons from '../../uiComponent/RadioButtons';
import deleteIcon from '../../assets/images/delete.svg';
import plusIcon from '../../assets/images/plus.svg';
import IconButton from '../../uiComponent/IconButton';
import { areaAnnotationDirection } from '../../constants/annotations';
import ColorPicker from '../../uiComponent/ColorPicker';

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
  const { errors: formErrors, control, watch, register, isEditMode } = useFormContext();
  const annotationConfigKey = `${configKey}.${ANNOTATION_NAME}`;
  const { fields, remove, append } = useFieldArray({ control, name: annotationConfigKey });
  const errors = formErrors[configKey] || { annotations: [] };

  useEffect(() => {
    if (!isEditMode) append({});
  }, []);

  const showAnnotationConfig = watch(`${configKey}.${areaAnnotationConfig.ANNOTATION_TOGGLE}`);

  return (
    <Box>
      <Box mb={4} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Annotation</Typography>
        <Box ml={2}>
          <AntSwitch
            dataTestid="toggle-time-slider"
            control={control}
            name={`${configKey}.${areaAnnotationConfig.ANNOTATION_TOGGLE}`}
            onLabel="Yes"
            offLabel="No"
          />
        </Box>
      </Box>
      {showAnnotationConfig && (
        <>
          {fields.map(({ id, ...data }, index) => {
            const lastFieldIndex = fields.length - 1;
            const annotationErrors = errors.annotations;
            return (
              <Box className={classes.configContainer} key={id}>
                <Box>
                  <Box className={[classes.fieldContainer, classes.directionContainer].join(' ')}>
                    <Typography variant="subtitle2">Axis</Typography>
                    <Box ml={2}>
                      <RadioButtons
                        control={control}
                        defaultValue={data[areaAnnotationConfig.DIRECTION] || defaultDirection}
                        name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.DIRECTION}`}
                        options={directions}
                        vertical={false}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Label</Typography>
                    <Box mt={2}>
                      <UncontrolledInputField
                        defaultValue={data[areaAnnotationConfig.ANNOTATION_LABEL] || ''}
                        name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.ANNOTATION_LABEL}`}
                        register={register}
                        error={
                          annotationErrors[index] &&
                          annotationErrors[index][areaAnnotationConfig.ANNOTATION_LABEL]
                        }
                        label="Enter label"
                        dataTestid="label-input"
                        validations={{
                          required: 'Required',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Position</Typography>
                    <Box className={classes.timeFieldContainer}>
                      <UncontrolledInputField
                        defaultValue={data[areaAnnotationConfig.START] || ''}
                        name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.START}`}
                        register={register}
                        error={
                          annotationErrors[index] &&
                          annotationErrors[index][areaAnnotationConfig.START]
                        }
                        label="From value"
                        dataTestid="start-input"
                        validations={{
                          required: 'Required',
                        }}
                      />
                      <UncontrolledInputField
                        defaultValue={data[areaAnnotationConfig.END] || ''}
                        name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.END}`}
                        register={register}
                        error={
                          annotationErrors[index] &&
                          annotationErrors[index][areaAnnotationConfig.END]
                        }
                        label="To Value"
                        dataTestid="end-input"
                        validations={{
                          required: 'Required',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Controller
                      control={control}
                      defaultValue={
                        data[areaAnnotationConfig.COLOR] || {
                          r: '241',
                          g: '112',
                          b: '19',
                          a: '1',
                        }
                      }
                      name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.COLOR}`}
                      render={({ onChange, value }) => (
                        <ColorPicker onChange={onChange} value={value} dataTestId="color-picker" />
                      )}
                    />
                  </Box>
                  <Box className={classes.fieldContainer}>
                    <Typography variant="subtitle2">Opacity</Typography>
                    <Box mt={2}>
                      <UncontrolledInputField
                        defaultValue={data[areaAnnotationConfig.OPACITY] || ''}
                        type="number"
                        name={`${annotationConfigKey}.[${index}].${areaAnnotationConfig.OPACITY}`}
                        register={register}
                        error={
                          annotationErrors[index] &&
                          annotationErrors[index][areaAnnotationConfig.OPACITY]
                        }
                        label="Enter opacity"
                        dataTestid="opacity-input"
                        validations={{
                          required: 'Required',
                          min: { value: 0, message: 'opacity should be from 0  to 1' },
                          max: { value: 1, message: 'opacity should be from 0  to 1' },
                        }}
                        inputProps={{ min: 0, max: 1, step: 0.1 }}
                      />
                    </Box>
                  </Box>
                </Box>
                {index === lastFieldIndex && (
                  <Box p={2}>
                    <IconButton
                      onClick={() => remove(index)}
                      data-testid={`delete-button-${index}`}
                    >
                      <img src={deleteIcon} alt="icon" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            );
          })}
          <Box className={classes.addMetricButtonContainer}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => append({})}
              startIcon={<img src={plusIcon} alt="icon" />}
            >
              Add Annotation
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

AnnotationConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
};

export default AnnotationConfig;
