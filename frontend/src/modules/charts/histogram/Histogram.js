import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { api } from '../../../utils/api';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { ChartFullSizeWrapper, configs, layoutConfig, tooltip } from '../chartStyleConfig';
import { chartColorsPallet } from '../../../theme/colorPalette';

function Histogram({ config }) {
  const { measure, dataSource } = config;
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
  }, [measure]);

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchData,
  };

  function createData(rawData) {
    const color = chartColorsPallet[1][0];
    return [
      {
        x: rawData[measure],
        type: 'histogram',
        name: measure,
        ...tooltip(measure, color),
      },
    ];
  }

  const chartMemo = useMemo(() => {
    const data = fetchedData && createData(fetchedData.data);
    return { data };
  }, [measure, fetchedData]);

  return (
    <LoaderOrError message={message} loadingState={loadingState} errorAction={onErrorAction}>
      <ChartFullSizeWrapper>
        {fetchedData && (
          <Plot
            layout={layoutConfig(measure)}
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
  }).isRequired,
};

export default Histogram;
