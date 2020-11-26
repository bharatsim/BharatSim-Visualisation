import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { fireEvent } from '@testing-library/dom';
import BarChart from '../BarChart';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { withRouter } from '../../../../testUtil';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { data: { exposed: [2, 3], hour: [1, 2] } },
    }),
  },
}));

describe('BarChart', () => {
  const BarChartWithProvider = withThemeProvider(withRouter(BarChart));

  it('should have fetched text in <BarChart /> component', async () => {
    const { container } = render(
      <BarChartWithProvider
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
      <BarChartWithProvider
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

  it('should show loader while fetching data', async () => {
    render(
      <BarChartWithProvider
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
      <BarChartWithProvider
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
      <BarChartWithProvider
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
