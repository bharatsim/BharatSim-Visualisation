/* eslint-disable react/prop-types */
import React from 'react';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import GeoDimensionsConfig from '../modules/chartConfigOptions/GeoDimensionsConfig';
import ChartConfigDropdown from '../modules/chartConfigOptions/ChartConfigDropdown';
import TimeSliderConfig from '../modules/chartConfigOptions/TimeSliderConfig';
import DatasourceSelector from '../modules/dashboard/dashboardConfigSelector/DatasourceSelector';
import { shapeFileFilter } from '../utils/helper';

const chartConfigOptions = {
  [chartConfigOptionTypes.X_AXIS]: {
    component: ({ headers, control, errors }) => (
      <ChartConfigDropdown
        headers={headers}
        id="x-axis-dropdown"
        label="select x axis"
        title="X-axis"
        control={control}
        configKey={chartConfigOptionTypes.X_AXIS}
        error={errors[chartConfigOptionTypes.X_AXIS]}
      />
    ),
  },
  [chartConfigOptionTypes.Y_AXIS]: {
    component: ({ headers, control, errors, isEditMode }) => (
      <YAxisChartConfig
        headers={headers}
        handleConfigChange={headers}
        configKey={chartConfigOptionTypes.Y_AXIS}
        errors={errors[chartConfigOptionTypes.Y_AXIS]}
        control={control}
        isEditMode={isEditMode}
      />
    ),
  },

  [chartConfigOptionTypes.GEO_DIMENSIONS]: {
    component: ({ headers, control, errors }) => (
      <GeoDimensionsConfig
        headers={headers}
        control={control}
        configKey={chartConfigOptionTypes.GEO_DIMENSIONS}
        errors={errors[chartConfigOptionTypes.GEO_DIMENSIONS]}
      />
    ),
  },

  [chartConfigOptionTypes.GEO_METRIC_SERIES]: {
    component: ({ headers, control, errors }) => (
      <ChartConfigDropdown
        headers={headers}
        id="dropdown-geo-metric-series"
        label="select metric"
        title="Geo Metric"
        control={control}
        configKey={chartConfigOptionTypes.GEO_METRIC_SERIES}
        error={errors[chartConfigOptionTypes.GEO_METRIC_SERIES]}
      />
    ),
  },
  [chartConfigOptionTypes.GIS_SHAPE_LAYER]: {
    component: ({ control, errors, isEditMode }) => (
      <DatasourceSelector
        isEditMode={isEditMode}
        name={chartConfigOptionTypes.GIS_SHAPE_LAYER}
        control={control}
        disabled={isEditMode}
        filterDatasource={shapeFileFilter}
        noDataSourcePresentMessage="Before we can create any GIS visualization, we‘ll need some GIS layer data."
        error={errors[chartConfigOptionTypes.GIS_SHAPE_LAYER]}
        header="GIS shape layer"
        id="gisShapeLayer-dropdown"
        label="select GIS shape layer source"
      />
    ),
  },
  [chartConfigOptionTypes.GIS_REGION_ID]: {
    component: ({ headers, control, errors }) => (
      <ChartConfigDropdown
        headers={headers}
        id="gis-region-id"
        label="select region id"
        title="GIS Region Id"
        control={control}
        configKey={chartConfigOptionTypes.GIS_REGION_ID}
        error={errors[chartConfigOptionTypes.GIS_REGION_ID]}
      />
    ),
  },
  [chartConfigOptionTypes.GIS_MEASURE]: {
    component: ({ headers, control, errors }) => (
      <ChartConfigDropdown
        control={control}
        headers={headers}
        id="gis-measure"
        label="select measure"
        title="GIS Measure"
        configKey={chartConfigOptionTypes.GIS_MEASURE}
        error={errors[chartConfigOptionTypes.GIS_MEASURE]}
      />
    ),
  },
  [chartConfigOptionTypes.SLIDER_CONFIG]: {
    component: ({ headers, control, watch, register, errors }) => (
      <TimeSliderConfig
        control={control}
        watch={watch}
        register={register}
        headers={headers}
        configKey={chartConfigOptionTypes.SLIDER_CONFIG}
        errors={errors[chartConfigOptionTypes.SLIDER_CONFIG]}
      />
    ),
  },
};

export default chartConfigOptions;
