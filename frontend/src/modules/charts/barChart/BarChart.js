import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { getYaxisNames, trasformDataForChart } from '../utils';
import useFetch from '../../../hook/useFetch';
import { api } from '../../../utils/api';

const options = { maintainAspectRatio: false, responsive: true };

function BarChart({ config }) {
  const { xAxis: xColumn, yAxis, dataSource } = config;
  const yColumns = getYaxisNames(yAxis);

  const { data: csvData } = useFetch(api.getData, [dataSource, [xColumn, ...yColumns]]);

  const transformedData = trasformDataForChart(csvData, xColumn, yColumns);

  return <Bar data={transformedData} options={options} />;
}

BarChart.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    xAxis: PropTypes.string.isRequired,
    yAxis: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default BarChart;
