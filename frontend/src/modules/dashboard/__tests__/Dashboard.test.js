import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';

jest.mock('../../charts/lineChart/LineChart', () => (props) => (
  <>
    {JSON.stringify(props, null, 2)} 
    {' '}
    <div>LINE CHART</div>
  </>
));

jest.mock('../../../utils/api', () => ({
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

describe('<Dashboard />', () => {
  const DashboardWithProviders = withThemeProvider(withProjectLayout(withRouter(Dashboard)));
  it('should add dashboard name to dashboard component', () => {
    const { getByText } = render(<DashboardWithProviders />);

    const dashboardName = getByText('dashboard1');

    expect(dashboardName).toBeInTheDocument();
  });

  it('should open side wizard on click of add chart from header', () => {
    const { getByText, getByTestId } = render(<DashboardWithProviders />);

    const addChartButton = getByTestId('button-add-chart-header');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });

  it('should open side wizard on click of add chart from widget', () => {
    const { getByText, getByTestId } = render(<DashboardWithProviders />);

    const addChartButton = getByTestId('button-add-chart-widget');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });

  it('should add chart', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;

    const addChartButton = getByTestId('button-add-chart-header');
    fireEvent.click(addChartButton);

    const lineChartOption = getByTestId('lineChart');
    const nextButton = getByText('Next');
    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);

    await findByText('Data Source');
    const chartNameInput = getByLabelText('Add chart name');
    fireEvent.change(chartNameInput, {
      target: { value: 'chart name' },
    });
    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');
    selectDropDownOption(renderedComponent, 'dropdown-y-0', 'column2');

    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);
    const lineChart = getByText('LINE CHART');
    expect(lineChart).toBeInTheDocument();
  });

  it('should close modal on click of close icon', () => {
    const { queryByText, getByTestId } = render(<DashboardWithProviders />);

    const addChartButton = getByTestId('button-add-chart-header');

    fireEvent.click(addChartButton);

    const closeIconButton = getByTestId('close-wizard');

    fireEvent.click(closeIconButton);

    expect(queryByText('Chart Configuration Wizard')).not.toBeInTheDocument();
  });
});
