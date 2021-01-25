import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { fireEvent } from '@testing-library/dom';
import LineChart from '../LineChart';
import { api } from '../../../../utils/api';
import { withRouter } from '../../../../testUtil';
import withThemeProvider from '../../../../theme/withThemeProvider';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { data: { exposed: [2, 3], hour: [1, 2] } },
    }),
  },
}));

describe('LineChart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const LineChartWithProvider = withThemeProvider(withRouter(LineChart));

  it('should create a line chart with single yaxis <LineChart /> component', async () => {
    const { container } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: 'hour',
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
      />,
    );

    await waitFor(() => document.getElementsByTagName('canvas'));

    expect(container).toMatchSnapshot();
  });

  it('should call get data api for given data column and datasource', async () => {
    render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: 'hour',
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
      />,
    );

    await waitFor(() => document.getElementsByTagName('canvas'));

    expect(api.getData).toHaveBeenCalledWith('dataSource', ['hour', 'exposed']);
  });

    it('should get data whenever column name are updated',  () => {
        const config ={
            dataSource: 'dataSource',
            xAxis: 'hour',
            yAxis: [{ type: 'number', name: 'exposed' }]
        };
        const configWithNewXaxis ={
           ...config,
            xAxis: 'newHour'
        };
        const configWithNewYaxis ={
            ...config,
            yAxis: [{ type: 'number', name: 'newExposed' }]

        };
        [configWithNewXaxis, configWithNewYaxis].forEach((updatedConfig)=>{
            jest.clearAllMocks()
            const {rerender} = render(
              <LineChartWithProvider
                config={config}
              />,
            );
            
            expect(api.getData).toHaveBeenCalledWith('dataSource', ['hour', 'exposed']);
            
            rerender( <LineChartWithProvider
              config={updatedConfig}
            />)
            expect(api.getData).toHaveBeenCalledWith('dataSource',[updatedConfig.xAxis, ...updatedConfig.yAxis.map(y=>y.name)] );

        })
        
    });

  it('should show loader while fetching data', async () => {
    render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: 'hour',
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await waitFor(() => {});
  });

  it('should show error if error occur while fetching data', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: 'hour',
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should again fetch data on click on retry button present on error banner', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: 'hour',
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
      />,
    );

    await findByText('Unable to fetch data');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    expect(api.getData).toHaveBeenCalled();
    await waitFor(() => {});
  });
});
