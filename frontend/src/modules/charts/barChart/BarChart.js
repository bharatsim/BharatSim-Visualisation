import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { getYaxisNames } from '../utils';
import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import useDeepCompareMemoize from '../../../hook/useDeepCompareMemoize';
import { layoutConfig, configs, tooltip, yAxisLegendName } from '../chartStyleConfig';
import { chartColorsPallet } from '../../../theme/colorPalette';
import LogScaleSwitch from '../../../uiComponent/LogScaleSwitch';
import useToggle from '../../../hook/useToggle';

function BarChart({ config }) {
  const { xAxis, yAxis, dataSource } = config;
  const { columnName: xColumn, type: xAxisType } = xAxis;
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
        name: yAxisLegendName(yCol),
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
  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <div style={{ width: '100%', height: '100%', padding: 0 }}>
        <LogScaleSwitch onChange={() => toggleState()} isChecked={isLogScale} />
        {fetchedData && (
          <Plot
            layout={layoutConfig(xColumn, xAxisType, yAxisType)}
            data={createData(fetchedData.data)}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
            config={configs}
          />
        )}
      </div>
    </LoaderOrError>
  );
}

BarChart.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    xAxis: PropTypes.shape({
      columnName: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    yAxis: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default BarChart;
