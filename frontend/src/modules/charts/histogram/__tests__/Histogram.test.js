import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { api } from '../../../../utils/api';
import { withRouter } from '../../../../testUtil';
import withThemeProvider from '../../../../theme/withThemeProvider';
import Histogram from '../Histogram';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { exposed: [2, 3], exposedNew: [3, 4] },
    }),
  },
}));

jest.mock('react-plotly.js', () => (props) => (
  <div>
    <span>Histogram</span>
    {/* eslint-disable-next-line no-undef */}
    <pre>{mockPropsCapture(props)}</pre>
  </div>
));

describe('Histogram', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const HistogramWithProvider = withThemeProvider(withRouter(Histogram));

  it('should create a histogram with selected measure', async () => {
    const { container, findByText } = render(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
        }}
      />,
    );

    await findByText('Histogram');

    expect(container).toMatchSnapshot();
  });

  it('should call get data api for given data column and datasource', async () => {
    const { findByText } = render(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
        }}
      />,
    );

    await findByText('Histogram');

    expect(api.getData).toHaveBeenCalledWith('dataSource', ['exposed']);
  });

  it('should get data whenever column name are updated', async () => {
    const { rerender, findByText } = render(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
        }}
      />,
    );

    await findByText('Histogram');

    rerender(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposedNew',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
        }}
      />,
    );

    await findByText('Histogram');

    expect(api.getData).toHaveBeenLastCalledWith('dataSource', ['exposedNew']);
  });

  it('should show loader while fetching data', async () => {
    render(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
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
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
        }}
      />,
    );

    await findByText('Unable to fetch data');

    expect(getByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should again fetch data on click on retry button present on error banner', async () => {
    api.getData.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <HistogramWithProvider
        config={{
          dataSource: 'dataSource',
          measure: 'exposed',
          color: { r: 1, g: 1, b: 1, a: 1 },
          axisConfig: {
            xAxisTitle: 'xAxisTestTitle',
            yAxisTitle: 'yAxisTestTitle',
          },
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
