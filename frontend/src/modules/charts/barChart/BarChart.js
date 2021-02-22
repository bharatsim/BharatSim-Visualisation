import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { getYaxisNames, trasformDataForChart } from '../utils';
import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';

const options = { maintainAspectRatio: false, responsive: true };

function BarChart({ config }) {
  const { xAxis: xColumn, yAxis, dataSource } = config;
  const yColumns = getYaxisNames(yAxis);
  const [fetchedData, setFetchedData] = useState();
  const {
    loadingState,
    message,
    startLoader,
    stopLoaderAfterError,
    stopLoaderAfterSuccess,
  } = useLoader();

  const yAxisDeps = useDeepCompareMemoize(yAxis);

  async function fetchData() {
    startLoader();
    return api
      .getData(dataSource, [xColumn, ...yColumns])
      .then((data) => {
        stopLoaderAfterSuccess();
        setFetchedData(data);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data');
      });
  }

  useEffect(() => {
    fetchData();
  }, [xColumn, yAxisDeps]);

  const transformedData = useMemo(
    () => (fetchedData ? trasformDataForChart(fetchedData, xColumn, yColumns) : {}),
    [fetchedData],
  );

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <Bar data={transformedData} options={options} />
    </LoaderOrError>
  );
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
