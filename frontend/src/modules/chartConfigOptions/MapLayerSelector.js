import React from 'react';
import { useFormContext } from 'react-hook-form';

import DatasourceSelector from '../dashboard/dashboardConfigSelector/DatasourceSelector';
import { chartConfigOptionTypes } from '../../constants/chartConfigOptionTypes';
import { shapeFileFilter } from '../../utils/helper';

function MapLayerSelector() {
  const { isEditMode } = useFormContext();
  return (
    <DatasourceSelector
      name={chartConfigOptionTypes.GIS_SHAPE_LAYER}
      filterDatasource={shapeFileFilter}
      noDataSourcePresentMessage="Before we can create any GIS visualization, we‘ll need some GIS layer data."
      header="GIS shape layer"
      id="gisShapeLayer-dropdown"
      label="select GIS shape layer source"
      disabled={isEditMode}
    />
  );
}

export default MapLayerSelector;
