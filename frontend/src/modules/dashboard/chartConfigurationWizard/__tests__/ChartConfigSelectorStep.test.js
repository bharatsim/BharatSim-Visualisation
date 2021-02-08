import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChartConfigSelectorStep from '../ChartConfigSelectorStep';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { withProjectLayout, withRouter } from '../../../../testUtil';

jest.mock('../../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1' },
        { name: 'datasource2', _id: 'id2' },
      ],
    }),
    getCsvHeaders: jest.fn().mockResolvedValue({
      headers: [
        { name: 'column1', type: 'number' },
        { name: 'column2', type: 'number' },
      ],
    }),
  },
}));
describe('chart config selector', () => {
  const ChartConfigSelectorStepWithTheme = withThemeProvider(
    withRouter(withProjectLayout(ChartConfigSelectorStep)),
  );
  it('should match snapshot', async () => {
    const { container, findByText } = render(
      <ChartConfigSelectorStepWithTheme
        chartType="lineChart"
        onApply={jest.fn()}
        backToChartType={jest.fn()}
      />,
    );
    await findByText('Data Source');
    expect(container).toMatchSnapshot();
  });
  

  it('should call back to chart type selector', async () => {
    const backToChartType = jest.fn();
    const { findByText, getByText } = render(
      <ChartConfigSelectorStepWithTheme
        chartType="lineChart"
        onApply={jest.fn()}
        backToChartType={backToChartType}
      />,
    );
    await findByText('Data Source');

    const backToChartTypeButton = getByText('Back to chart type').closest('button');
    fireEvent.click(backToChartTypeButton);

    expect(backToChartType).toHaveBeenCalled();
  });
});
