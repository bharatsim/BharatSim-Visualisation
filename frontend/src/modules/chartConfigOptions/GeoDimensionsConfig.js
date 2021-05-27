import React from 'react';
import PropTypes from 'prop-types';

import { geoDimensionsField } from '../../constants/geoMap';
import HeaderSelector from './HeaderSelector';
import { required } from '../../utils/validators';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

function GeoDimensionsConfig({ headers, configKey }) {
  return (
    <FieldsContainer title="Geo Dimension" orientation="horizontal">
      <HeaderSelector
        id="latitude"
        label="Select latitude"
        title="Latitude"
        headers={headers}
        configKey={`${configKey}.${geoDimensionsField.LAT}`}
        border={false}
        validate={required}
      />
      <HeaderSelector
        id="longitude"
        label="Select longitude"
        title="Longitude"
        headers={headers}
        configKey={`${configKey}.${geoDimensionsField.LON}`}
        border={false}
        validate={required}
      />
    </FieldsContainer>
  );
}

GeoDimensionsConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default GeoDimensionsConfig;
