import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import equal from 'fast-deep-equal/es6/react';

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
import useToggle from '../../../hook/useToggle';
import LogScaleSwitch from '../../../uiComponent/LogScaleSwitch';
import { rgbaToHex } from '../../../utils/helper';

function LineChart({ config, layout }) {
  const { xAxis, yAxis, dataSource, annotation, axisConfig } = config;
  const { columnName: xColumn, type: xAxisType } = xAxis;
  const { annotations, annotationToggle } = annotation || {};
  const yColumns = getYaxisNames(yAxis);
  const [fetchedData, setFetchedData] = useState();
  const [revision, setRevision] = useState(0);
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

  const memoizeConfig = useDeepCompareMemoize(config);
  useEffect(() => {
    setRevision((prev) => prev + 1);
  }, [memoizeConfig, layout.h, layout.w]);

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  function createData(rawData) {
    return yColumns.map((yCol, index) => {
      const { color: rgbaColor, seriesType: dash, seriesWidth: width } = yAxis[index];
      const color = rgbaToHex(rgbaColor);
      return {
        x: rawData[xColumn],
        y: rawData[yCol],
        type: 'scattergl',
        name: yAxisLegendName(yCol),
        line: line({ color, dash, width }),
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
    return { data, n: Math.random() };
  }, [xColumn, xAxisType, yAxisType, fetchedData, annotations]);

  const chartLayout = layoutConfig({
    xColumn,
    xAxisType,
    yAxisType,
    annotations,
    annotationToggle,
    revision,
    axisConfig,
  });

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <ChartFullSizeWrapper>
        <LogScaleSwitch onChange={() => toggleState()} isChecked={isLogScale} />
        {fetchedData && (
          <Plot
            layout={chartLayout}
            data={chartMemo.data}
            useResizeHandler
            revision={revision}
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
        color: PropTypes.shape.isRequired,
        seriesType: PropTypes.string.isRequired,
        seriesWidth: PropTypes.number.isRequired,
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
    axisConfig: PropTypes.shape({
      xAxisTitle: PropTypes.string,
      yAxisTitle: PropTypes.string,
    }).isRequired,
  }).isRequired,
  layout: PropTypes.shape({ h: PropTypes.number, w: PropTypes.number }).isRequired,
};

function isEqual(prevProps, newProps) {
  return (
    equal(prevProps.config, newProps.config) &&
    prevProps.layout.h === newProps.layout.h &&
    prevProps.layout.w === newProps.layout.w
  );
}
export default React.memo(LineChart, isEqual);
