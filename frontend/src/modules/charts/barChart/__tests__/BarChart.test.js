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
      data: { exposed: [2, 3], hour: [1, 2], hourNew: [1, 2] },
    }),
  },
}));

jest.mock('react-plotly.js', () => (props) => (
  <div>
    <span>bar chart</span>
    {/* eslint-disable-next-line no-undef */}
    <pre>{mockPropsCapture(props)}</pre>
  </div>
));

describe('BarChart', () => {
  const BarChartWithProvider = withThemeProvider(withRouter(BarChart));

  it('should have fetched text in <BarChart /> component', async () => {
    const { container, findByText } = render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    expect(container).toMatchSnapshot();
  });

  it('should make yaxis scale type to log on toggle switch to  log scale', async () => {
    const { findByText, getByRole, getByText } = render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 4, w: 3 }}
      />,
    );

    await findByText('bar chart');

    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    expect(getByText('"type":"log"', { exact: false })).toBeInTheDocument();
  });

  it('should get data whenever column name are updated', async () => {
    const { rerender, findByText } = render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    rerender(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hourNew', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    expect(api.getData).toHaveBeenLastCalledWith('dataSource', ['hourNew', 'exposed']);
  });

  it('should call data if column name are same', async () => {
    const { rerender, findByText } = render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    rerender(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    expect(api.getData).not.toHaveBeenLastCalledWith('dataSource', ['hourNew', 'exposed']);
  });

  it('should call get data api for given data column and datasource', async () => {
    const { findByText } = render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
        }}
        layout={{ h: 1, w: 2 }}
      />,
    );

    await findByText('bar chart');

    expect(api.getData).toHaveBeenCalledWith('dataSource', ['hour', 'exposed']);
  });

  it('should show loader while fetching data', async () => {
    render(
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
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
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
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
      <BarChartWithProvider
        config={{
          dataSource: 'dataSource',
          xAxis: { columnName: 'hour', type: 'linear' },
          yAxis: [{ type: 'number', name: 'exposed', color: { r: 1, g: 1, b: 1, a: 1 } }],
          axisConfig: {},
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
