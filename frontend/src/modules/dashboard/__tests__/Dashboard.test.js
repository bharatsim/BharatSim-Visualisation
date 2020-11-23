import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';
import { selectDropDownOption } from '../../../testUtil';

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
  const DashboardWithProviders = withThemeProvider(() => (
    <ProjectLayoutProvider
      value={{
        selectedDashboardMetadata: {
          name: 'dashboardName',
        },
        projectMetadata: { name: 'project1' },
      }}
    >
      <Dashboard />
    </ProjectLayoutProvider>
  ));
  it('should add dashboard name to dashboard component', () => {
    const { getByText } = render(<DashboardWithProviders />);

    const dashboardName = getByText('dashboardName');

    expect(dashboardName).toBeInTheDocument();
  });

  it('should open side wizard on click of add chart', () => {
    const { getByText } = render(<DashboardWithProviders />);

    const addChartButton = getByText('Add Chart');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });
  it('should add chart', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText } = renderedComponent;
    const addChartButton = getByText('Add Chart');

    fireEvent.click(addChartButton);

    const lineChartOption = getByText('Line Chart');
    const nextButton = getByText('Next');
    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);

    await findByText('Data Source');
    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');
    selectDropDownOption(renderedComponent, 'dropdown-y', 'column2');

    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);
    const lineChart = getByText('LINE CHART');
    expect(lineChart).toBeInTheDocument();
  });

  it('should close modal on click of close icon', () => {
    const { getByText, queryByText, getByTestId } = render(<DashboardWithProviders />);

    const addChartButton = getByText('Add Chart');

    fireEvent.click(addChartButton);

    const closeIconButton = getByTestId('close-wizard');

    fireEvent.click(closeIconButton);

    expect(queryByText('Chart Configuration Wizard')).not.toBeInTheDocument();
  });
});
