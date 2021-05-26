import React from 'react';
import { useForm } from 'react-final-form';

import PropTypes from 'prop-types';
import ChoroplethMapLayerConfig from './ChoroplethMapLayerConfigs';
import { useFormContext } from '../../contexts/FormContext';
import FieldArrayContainer from '../../uiComponent/formField/FieldArrayContainer';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

function ChoroplethMultiMapLayerConfig({ configKey, headers }) {
  const { unRegisterDatasource } = useFormContext();

  const {
    mutators: { push, remove },
  } = useForm();

  function removeMapConfig(index) {
    remove(configKey, index);
    unRegisterDatasource(`${configKey}.[${index}].mapLayer`);
  }

  return (
    <FieldArrayContainer
      configKey={configKey}
      onAddClick={() => push(configKey)}
      addButtonTitle="Add level"
      onDelete={removeMapConfig}
      field={(name, index) => {
        const levelIndex = index + 1;
        return (
          <FieldsContainer
            key={name}
            title={`Drill Down - ${index === 0 ? 'Level 1 (Top Level)' : `Level ${levelIndex}`}`}
          >
            <ChoroplethMapLayerConfig
              configKey={name}
              headers={headers}
              shouldShowReferenceIdConfig={index !== 0}
              levelIndex={index}
            />
          </FieldsContainer>
        );
      }}
    />
  );
}

ChoroplethMultiMapLayerConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default ChoroplethMultiMapLayerConfig;
