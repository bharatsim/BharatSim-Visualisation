import React from 'react';
import PropTypes from 'prop-types';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';

import DropDownField from '../../uiComponent/formField/SelectField';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

function HeaderSelector({ headers, configKey, label, title, id, disabled, validate, helperText }) {
  return (
    <FieldContainer title={title}>
      <DropDownField
        options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
        id={id}
        label={label}
        name={configKey}
        disabled={disabled}
        dataTestid={id}
        validate={validate}
        helperText={helperText}
      />
    </FieldContainer>
  );
}

HeaderSelector.defaultProps = {
  disabled: false,
  helperText: '',
  validate: null,
};

HeaderSelector.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.func,
};

export default HeaderSelector;
