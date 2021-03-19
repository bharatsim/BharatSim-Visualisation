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
      data: { exposed: [2, 3], hour: [1, 2], hourNew: [1, 2], exposedwithinfectedPeople: [2, 3] },
    }),
  },
}));

jest.mock('react-plotly.js', () => (props) => (
  <div>
    <span>line chart</span>
    {/* eslint-disable-next-line no-undef */}
    <pre>
      {/* eslint-disable-next-line no-undef */}
      <object>{mockPropsCapture(props)}</object>
    </pre>
  </div>
));

describe('LineChart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const LineChartWithProvider = withThemeProvider(withRouter(LineChart));

  it('should create a line chart with single yaxis <LineChart /> component', async () => {
    const { container, findByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    expect(container).toMatchSnapshot();
  });

  it('should make yaxis scale type to log on toggle switch to  log scale', async () => {
    const { findByText, getByRole, getByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    expect(getByText('"type":"log"', { exact: false })).toBeInTheDocument();
  });

  it('should wrap legend name if greter than 15 char with ellipsis', async () => {
    const { findByText, getByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposedwithinfectedPeople' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    expect(getByText('"name":"exposedwithi..."', { exact: false })).toBeInTheDocument();
  });

  it('should call get data api for given data column and datasource', async () => {
    const { findByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    expect(api.getData).toHaveBeenCalledWith('dataSource', ['hour', 'exposed']);
  });

  it('should get data whenever column name are updated', async () => {
    const { rerender, findByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    rerender(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hourNew', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 4, w: 3 }}
      />,
    );

    await findByText('line chart');

    expect(api.getData).toHaveBeenLastCalledWith('dataSource', ['hourNew', 'exposed']);
  });

  it('should not call get data whenever column name same', async () => {
    const { rerender, findByText } = render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    rerender(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('line chart');

    expect(api.getData).not.toHaveBeenLastCalledWith('dataSource', ['hourNew', 'exposed']);
  });

  it('should show loader while fetching data', async () => {
    render(
      <LineChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
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
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
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
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed' }],
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('Unable to fetch data');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    expect(api.getData).toHaveBeenCalled();
    await waitFor(() => {});
  });
});
