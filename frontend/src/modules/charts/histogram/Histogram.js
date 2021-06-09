import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import equal from 'fast-deep-equal/es6/react';

import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { ChartFullSizeWrapper, configs, layoutConfig, tooltip } from '../chartStyleConfig';
import { rgbaToHex } from '../../../utils/helper';

function Histogram({ config }) {
  const { measure, dataSource, color: rgbaColor, axisConfig } = config;
  const [fetchedData, setFetchedData] = useState();
  const { loadingState, message, startLoader, stopLoaderAfterError, stopLoaderAfterSuccess } =
    useLoader();

  async function fetchData() {
    startLoader();
    return api
      .getData(dataSource, [measure])
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
  }, [measure, dataSource]);

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  function createData(rawData) {
    const color = rgbaToHex(rgbaColor);
    return [
      {
        x: rawData[measure],
        type: 'histogram',
        name: measure,
        marker: {
          color,
        },
        ...tooltip(measure, color),
      },
    ];
  }

  const chartMemo = useMemo(() => {
    const data = fetchedData && createData(fetchedData.data);
    return { data };
  }, [measure, fetchedData, rgbaColor]);

  const layout = layoutConfig({ xColumn: measure, axisConfig });

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <ChartFullSizeWrapper>
        {fetchedData && (
          <Plot
            layout={layout}
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

Histogram.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    measure: PropTypes.string.isRequired,
    color: PropTypes.shape.isRequired,
    axisConfig: PropTypes.shape({
      xAxisTitle: PropTypes.string,
      yAxisTitle: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

function isEqual(prevProps, newProps) {
  return (
    equal(prevProps.config, newProps.config) &&
    prevProps.layout.h === newProps.layout.h &&
    prevProps.layout.w === newProps.layout.w
  );
}

export default React.memo(Histogram, isEqual);
