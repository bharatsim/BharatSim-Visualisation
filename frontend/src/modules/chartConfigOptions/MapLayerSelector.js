import React from 'react';

import DatasourceSelector from '../dashboard/dashboardConfigSelector/DatasourceSelector';
import { chartConfigOptionTypes } from '../../constants/chartConfigOptionTypes';
import { shapeFileFilter } from '../../utils/helper';
import { required } from '../../utils/validators';
import { useFormContext } from '../../contexts/FormContext';

function MapLayerSelector() {
  const { isEditMode } = useFormContext();
  return (
    <DatasourceSelector
      name={chartConfigOptionTypes.GIS_SHAPE_LAYER}
      datasourceFilter={shapeFileFilter}
      noDataSourcePresentMessage="Before we can create any GIS visualizations, we‘ll need some GIS layer data."
      header="GIS shape layer"
      id="gisShapeLayer-dropdown"
      label="Select GIS shape layer source"
      disabled={isEditMode}
      validate={required}
    />
  );
}

export default MapLayerSelector;
