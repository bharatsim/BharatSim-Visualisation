import { chartStyleConfig, getColor } from './chartStyleConfig';

function trasformDataForChart(fetchedData, xColumn, yColumns) {
  return {
    labels: fetchedData && fetchedData.data[xColumn],
    datasets:
      fetchedData &&
      yColumns.map((yColumn, index) => {
        return {
          ...chartStyleConfig,
          label: yColumn,
          borderColor: getColor(index),
          backgroundColor: getColor(index),
          data: fetchedData && fetchedData.data[yColumn],
        };
      }),
  };
}

function getYaxisNames(yColumns) {
  return yColumns.map((yColumn) => yColumn.name);
}

export { trasformDataForChart, getYaxisNames };
