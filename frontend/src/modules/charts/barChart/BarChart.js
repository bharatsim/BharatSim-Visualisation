import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { getYaxisNames } from '../utils';
import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';
import { plotlyChartLayoutConfig, plotlyConfigOptions, tooltip } from '../chartStyleConfig';
import { chartColorsPallet } from '../../../theme/colorPalette';

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

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };
  function createData(rawData) {
    return yColumns.map((yCol, index) => {
      const color = chartColorsPallet[1][index];
      return {
        x: rawData[xColumn],
        y: rawData[yCol],
        type: 'bar',
        name: yCol,
        line: { shape: 'spline' },
        showspikes: true,
        scale: 'log',
        ...tooltip(color),
      };
    });
  }
  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <div style={{ width: '100%', height: '100%', padding: 0 }}>
        {fetchedData && (
          <Plot
            layout={plotlyChartLayoutConfig(xColumn)}
            data={createData(fetchedData.data)}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
            config={plotlyConfigOptions}
          />
        )}
      </div>
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
