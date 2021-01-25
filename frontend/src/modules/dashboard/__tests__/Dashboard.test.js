import React from 'react';
import { fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import {
  renderWithRedux as render,
  selectDropDownOption,
  withProjectLayout,
  withRouter,
} from '../../../testUtil';
import { api } from '../../../utils/api';

jest.mock('../../charts/lineChart/LineChart', () => (props) => (
  <>
    {JSON.stringify(props, null, 2)}
    <div>LINE CHART</div>
  </>
));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../constants.js', () => ({
  ...jest.requireActual('../constants.js'),
  AUTOSAVE_DEBOUNCE_TIME: 0,
}));

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
  const DashboardWithProviders = withRouter(withThemeProvider(withProjectLayout(Dashboard)));
  afterEach(() => {
    jest.clearAllMocks();
  });

  const addChart = async (renderedComponent) => {
    const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;

    const addChartButton = getByTestId('button-add-chart-header');
    fireEvent.click(addChartButton);

    const lineChartOption = getByTestId('lineChart');
    fireEvent.click(lineChartOption);

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
  };

  it('should add dashboard name to dashboard component', async () => {
    const { getByText, findByTestId } = render(<DashboardWithProviders />);

    await findByTestId('button-add-chart-widget');
    const dashboardName = getByText('dashboard1');

    expect(dashboardName).toBeInTheDocument();
  });

  it('should fetch dashboard only once', async () => {
    const { findByTestId, rerender } = render(<DashboardWithProviders />);
    await findByTestId('button-add-chart-widget');
    rerender(<DashboardWithProviders />);
    expect(api.getDashboard).toBeCalledTimes(1);
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

  it('should add chart and auto save', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText } = renderedComponent;

    await findByText('dashboard1');

    await addChart(renderedComponent);

    await findByText('Saving...', { timeout: 2300 });
    const lineChart = getByText('LINE CHART');

    await findByText('Last Saved', { exact: false });
    expect(lineChart).toBeInTheDocument();
    expect(api.saveDashboard).toBeCalled();
  });

  it('should edit chart and auto save', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { queryByText,getByText, findByText, getByTestId, getByLabelText , debug} = renderedComponent;

    await findByText('dashboard1');

    await addChart(renderedComponent);
    await findByText('Last Saved', { exact: false });

    expect(queryByText('chart name')).toBeInTheDocument()

    fireEvent.click(getByTestId('widget-menu'));
    fireEvent.click(getByText('Configure Chart'));

    const chartNameInput = getByLabelText('Add chart name');
    fireEvent.change(chartNameInput, {
      target: { value: 'edited chart name' },
    });
    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);

    await findByText('Saving...', { timeout: 2300 });
    await findByText('Last Saved', { exact: false });

    expect(queryByText('chart name')).not.toBeInTheDocument();
    expect(queryByText('edited chart name')).toBeInTheDocument();
    expect(api.saveDashboard).toBeCalled();
  });

  it('should show error if any while saving the dashboard', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    api.saveDashboard.mockRejectedValueOnce('Error');
    const { getByText, findByText } = renderedComponent;
    await findByText('dashboard1');

    await addChart(renderedComponent);

    await findByText('Unable to save the dashboard', { timeout: 2300 });

    expect(getByText('Unable to save the dashboard')).toBeInTheDocument();

    const retry = getByText('Retry');
    fireEvent.click(retry);
    await findByText('Last Saved', { exact: false });

    expect(getByText('Last Saved', { exact: false })).toBeInTheDocument();
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

  it('should navigate to configure data on click on manage data', async () => {
    const { getByText, findByText } = render(<DashboardWithProviders />);
    await findByText('dashboard1');

    const manageDataButton = getByText('Manage Data').closest('button');

    fireEvent.click(manageDataButton);

    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/1/configure-dataset');
  });
  it('should navigate to configure data on click if no data sources are uploaded', async () => {
    api.getDatasources.mockResolvedValueOnce({
      dataSources: [],
    });
    const { findByText } = render(<DashboardWithProviders />);
    await findByText('dashboard1');
    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/1/configure-dataset');
  });

  it('should delete the widget and autoSave', async () => {
    const renderedComponent = render(<DashboardWithProviders />);
    const { getByText, findByText, getByTestId, queryByText } = renderedComponent;
    await findByText('dashboard1');
    await addChart(renderedComponent);
    await findByText('Last Saved', { exact: false });

    expect(getByText('LINE CHART')).toBeInTheDocument();

    fireEvent.click(getByTestId('widget-menu'));
    fireEvent.click(getByText('Delete Chart'));
    fireEvent.click(getByTestId('delete-chart-confirm'));

    await findByText('Saving...', { timeout: 2300 });
    await findByText('Last Saved', { exact: false });
    expect(queryByText('LINE CHART')).not.toBeInTheDocument();
  });
});
