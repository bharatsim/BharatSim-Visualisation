import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { api } from '../../../utils/api';
import { getYaxisNames } from '../utils';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';
import {
  ChartFullSizeWrapper,
  configs,
  layoutConfig,
  line,
  marker,
  tooltip,
  yAxisLegendName,
} from '../chartStyleConfig';
import { chartColorsPallet } from '../../../theme/colorPalette';
import useToggle from '../../../hook/useToggle';
import LogScaleSwitch from '../../../uiComponent/LogScaleSwitch';

function LineChart({ config }) {
  const { xAxis, yAxis, dataSource, annotation } = config;
  const { columnName: xColumn, type: xAxisType } = xAxis;
  const { annotations, annotationToggle } = annotation || {};
  const yColumns = getYaxisNames(yAxis);
  const [fetchedData, setFetchedData] = useState();
  const { state: isLogScale, toggleState } = useToggle();
  const yAxisType = isLogScale ? 'log' : '-';
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
        type: 'scattergl',
        name: yAxisLegendName(yCol),
        line,
        marker,
        mode: 'lines+markers',
        showspikes: true,
        transforms: [
          {
            type: 'sort',
            target: 'x',
          },
        ],
        ...tooltip(yCol, color),
      };
    });
  }
  const chartMemo = useMemo(() => {
    const data = fetchedData && createData(fetchedData.data);
    return { data };
  }, [xColumn, xAxisType, yAxisType, fetchedData]);

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <ChartFullSizeWrapper>
        <LogScaleSwitch onChange={() => toggleState()} isChecked={isLogScale} />
        {fetchedData && (
          <Plot
            layout={layoutConfig(xColumn, xAxisType, yAxisType, annotations, annotationToggle)}
            data={chartMemo.data}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
            config={configs}
          />
        )}
      </ChartFullSizeWrapper>
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
    annotation: PropTypes.shape({
      annotations: PropTypes.arrayOf(
        PropTypes.shape({
          direction: PropTypes.string,
          color: PropTypes.string,
          opacity: PropTypes.string,
          start: PropTypes.string,
          end: PropTypes.string,
          label: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
};

export default LineChart;
