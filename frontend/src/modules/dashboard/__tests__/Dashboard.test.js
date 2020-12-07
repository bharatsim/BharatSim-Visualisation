import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withSnackBar from '../../../hoc/withSnackBar';
import { api } from '../../../utils/api';
import withOverlayLoaderOrError from '../../../hoc/withOverlayLoaderOrError';

jest.mock('../../charts/lineChart/LineChart', () => (props) => (
  <>
    {JSON.stringify(props, null, 2)}
    <div>LINE CHART</div>
  </>
));

jest.mock('../../../utils/api', () => ({
  api: {
    saveDashboard: jest.fn().mockResolvedValue({
      dashboardId: 'dashboardId',
    }),
    getDashboard: jest.fn().mockResolvedValue({
      dashboard: { name: 'datasource1', _id: 'id1' },
    }),

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
  const DashboardWithProviders = withSnackBar(
    withOverlayLoaderOrError(withThemeProvider(withProjectLayout(withRouter(Dashboard)))),
  );
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add dashboard name to dashboard component', async () => {
    const { getByText, findByTestId } = render(<DashboardWithProviders />);

    await findByTestId('button-add-chart-widget');
    const dashboardName = getByText('dashboard1');

    expect(dashboardName).toBeInTheDocument();
  });
  it('should disable save button if there are no charts', async () => {
    const { getByText, findByTestId } = render(<DashboardWithProviders />);
    await findByTestId('button-add-chart-widget');
    const saveButton = getByText('Save').closest('button');

    expect(saveButton).toBeDisabled();
  });

  it('should return empty component when failed to fetch dashboard', async () => {
    api.getDashboard.mockResolvedValueOnce(undefined);
    const { container } = render(<DashboardWithProviders />);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should open side wizard on click of add chart from header', async () => {
    const { getByText, getByTestId, findByText } = render(<DashboardWithProviders />);

    await findByText('dashboard1');
    const addChartButton = getByTestId('button-add-chart-header');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });

  it('should open side wizard on click of add chart from widget', async () => {
    const { getByText, getByTestId, findByText } = render(<DashboardWithProviders />);
    await findByText('dashboard1');

    const addChartButton = getByTestId('button-add-chart-widget');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });

  it('should add chart', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;
    await findByText('dashboard1');

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
  it('should save dashboard on click of save button', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;
    await findByText('dashboard1');

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

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    await findByText('Saved Successfully');

    expect(getByText('Saved Successfully')).toBeInTheDocument();
  });
  it('should show error if any while saving the dashboard', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    api.saveDashboard.mockRejectedValueOnce('Error');
    const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;
    await findByText('dashboard1');

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

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    await findByText('Aw Snap! Failed to save dashboard dashboard1');

    expect(getByText('Aw Snap! Failed to save dashboard dashboard1')).toBeInTheDocument();
  });

  it('should close modal on click of close icon', async () => {
    const { queryByText, getByTestId, findByText } = render(<DashboardWithProviders />);
    await findByText('dashboard1');

    const addChartButton = getByTestId('button-add-chart-header');

    fireEvent.click(addChartButton);

    const closeIconButton = getByTestId('close-wizard');

    fireEvent.click(closeIconButton);

    expect(queryByText('Chart Configuration Wizard')).not.toBeInTheDocument();
  });
});
