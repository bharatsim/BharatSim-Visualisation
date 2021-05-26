import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';
import { useForm } from 'react-final-form';
import { format } from 'date-fns';
import get from 'lodash.get';
import { annotationTypes, areaAnnotationDirection, DATE_FORMAT } from '../../constants/annotations';
import RadioButtonsField from '../../uiComponent/formField/RadioButtonField';
import TextField from '../../uiComponent/formField/TextField';
import SwitchField from '../../uiComponent/formField/SwitchField';
import { useFormContext } from '../../contexts/FormContext';
import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import { required, validateToValueDate, validateToValueNumber } from '../../utils/validators';
import Condition from '../../uiComponent/formField/ConditionalField';
import SelectField from '../../uiComponent/formField/SelectField';
import DateField from '../../uiComponent/formField/DateField';
import { currentDate } from '../../utils/dateUtils';
import FieldArrayContainer from '../../uiComponent/formField/FieldArrayContainer';
import FieldContainer from '../../uiComponent/formField/FieldContainer';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

const areaAnnotationConfig = {
  ANNOTATION_TOGGLE: 'annotationToggle',
  START: 'start',
  END: 'end',
  DIRECTION: 'direction',
  ANNOTATION_LABEL: 'label',
  COLOR: 'color',
  OPACITY: 'opacity',
  TYPE: 'type',
};

const annotationTypeOptions = [
  { value: annotationTypes.DATE, displayName: 'Date' },
  { value: annotationTypes.NUMERIC, displayName: 'Numeric' },
];

const directions = [
  { label: 'X-Axis', value: areaAnnotationDirection.VERTICAL },
  { label: 'Y-Axis', value: areaAnnotationDirection.HORIZONTAL },
];

const defaultDirection = directions[0].value;
const ANNOTATION_NAME = 'annotations';

function AnnotationConfig({ configKey }) {
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
    if (showAnnotationConfig && !getFieldState(annotationConfigKey)?.value)
      push(annotationConfigKey);
  }, [showAnnotationConfig]);

  return (
    <Box>
      <FieldContainer title="Annotation" inline>
        <SwitchField
          dataTestId="toggle-time-slider"
          name={`${configKey}.${areaAnnotationConfig.ANNOTATION_TOGGLE}`}
          onLabel="Yes"
          offLabel="No"
          validate={required}
        />
      </FieldContainer>
      {showAnnotationConfig && (
        <FieldArrayContainer
          configKey={annotationConfigKey}
          addButtonTitle="Add Annotation"
          onAddClick={() => push(annotationConfigKey)}
          field={(name) => {
            return (
              <FieldsContainer key={name}>
                <FieldContainer title="Axis" inline>
                  <RadioButtonsField
                    name={`${name}.${areaAnnotationConfig.DIRECTION}`}
                    options={directions}
                    vertical={false}
                    defaultValue={defaultDirection}
                    validate={required}
                  />
                </FieldContainer>
                <FieldContainer title="Label">
                  <TextField
                    name={`${name}.${areaAnnotationConfig.ANNOTATION_LABEL}`}
                    label="Enter label"
                    dataTestId="label-input"
                    validate={required}
                  />
                </FieldContainer>
                <FieldContainer title="Type">
                  <SelectField
                    name={`${name}.${areaAnnotationConfig.TYPE}`}
                    options={annotationTypeOptions}
                    id="type-of-annotation-value"
                    label="select type"
                    validate={required}
                    defaultValue={annotationTypes.NUMERIC}
                  />
                </FieldContainer>
                <FieldContainer title="Position">
                  <Condition
                    when={`${name}.${areaAnnotationConfig.TYPE}`}
                    is={annotationTypes.NUMERIC}
                  >
                    <TextField
                      type="number"
                      name={`${name}.${annotationTypes.NUMERIC}.${areaAnnotationConfig.START}`}
                      label="From value"
                      dataTestId="start-input"
                      validate={required}
                    />
                    <TextField
                      type="number"
                      name={`${name}.${annotationTypes.NUMERIC}.${areaAnnotationConfig.END}`}
                      label="To Value"
                      dataTestId="end-input"
                      validate={(value, values) =>
                        validateToValueNumber(
                          value,
                          get(
                            values,
                            `${name}.${annotationTypes.NUMERIC}.${areaAnnotationConfig.START}`,
                          ),
                        )}
                    />
                  </Condition>
                  <Condition
                    when={`${name}.${areaAnnotationConfig.TYPE}`}
                    is={annotationTypes.DATE}
                  >
                    <DateField
                      name={`${name}.${annotationTypes.DATE}.${areaAnnotationConfig.START}`}
                      label="From value"
                      dataTestId="start-input"
                      validate={required}
                      isEditMode={isEditMode}
                      defaultValue={format(currentDate(), DATE_FORMAT)}
                      format={DATE_FORMAT}
                    />
                    <DateField
                      name={`${name}.${annotationTypes.DATE}.${areaAnnotationConfig.END}`}
                      label="To Value"
                      dataTestId="end-input"
                      isEditMode={isEditMode}
                      defaultValue={format(currentDate(), DATE_FORMAT)}
                      format={DATE_FORMAT}
                      validate={(value, values) =>
                        validateToValueDate(
                          value,
                          get(
                            values,
                            `${name}.${annotationTypes.DATE}.${areaAnnotationConfig.START}`,
                          ),
                        )}
                    />
                  </Condition>
                </FieldContainer>
                <FieldContainer>
                  <ColorPickerField
                    name={`${name}.${areaAnnotationConfig.COLOR}`}
                    validate={required}
                    isEditMode={isEditMode}
                  />
                </FieldContainer>
                <FieldContainer title="Opacity">
                  <TextField
                    type="number"
                    name={`${name}.${areaAnnotationConfig.OPACITY}`}
                    label="Enter opacity"
                    dataTestId="opacity-input"
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    validate={required}
                    defaultValue={0.1}
                  />
                </FieldContainer>
              </FieldsContainer>
            );
          }}
        />
      )}
    </Box>
  );
}

AnnotationConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
};

export default AnnotationConfig;
