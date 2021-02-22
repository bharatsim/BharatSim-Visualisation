import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { lineChartOptions } from '../chartStyleConfig';
import { api } from '../../../utils/api';
import { getYaxisNames, trasformDataForChart } from '../utils';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';

function LineChart({ config }) {
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
  }, [xColumn, ...yColumns]);

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
      <Line data={transformedData} options={lineChartOptions} />
    </LoaderOrError>
  );
}

LineChart.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    xAxis: PropTypes.string.isRequired,
    yAxis: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default React.memo(LineChart);
