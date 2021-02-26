import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { api } from '../../../utils/api';
import { getYaxisNames } from '../utils';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';
import {
  plotlyChartLayoutConfig,
  plotlyConfigOptions,
  tooltip,
  line,
  marker,
} from '../chartStyleConfig';
import { chartColorsPallet } from '../../../theme/colorPalette';

function LineChart({ config }) {
  const { xAxis, yAxis, dataSource } = config;
  const { columnName: xColumn, type: xAxisType } = xAxis;
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

  const yAxisDeps = useDeepCompareMemoize(yAxis);

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
        type: 'scatter',
        name: yCol,
        line,
        marker,
        mode: 'lines+markers',
        showspikes: true,
        ...tooltip(color),
        transforms: [
          {
            type: 'sort',
            target: 'x',
          },
        ],
      };
    });
  }

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <div style={{ width: '100%', height: '100%', padding: 0 }}>
        {fetchedData && (
          <Plot
            layout={plotlyChartLayoutConfig(xColumn, xAxisType)}
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

LineChart.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    xAxis: PropTypes.shape({
      columnName: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    yAxis: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default sizeMe({ monitorHeight: true })(LineChart);
