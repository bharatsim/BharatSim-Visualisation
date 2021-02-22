import React from 'react';
import { act, fireEvent, render as rtlRender } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import {
  renderWithRedux as render,
  selectDropDownOption,
  withProjectLayout,
  withRouter,
} from '../../../testUtil';
import { api } from '../../../utils/api';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';

jest.mock('../../charts/lineChart/LineChart', () => () => (
  <>
    <div className="lineChart">LINE CHART</div>
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

jest.mock('../../../utils/api', () => ({
  api: {
    saveDashboard: jest.fn().mockResolvedValue({
      dashboardId: 'id1',
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

const mockState = {
  dashboards: {
    autoSaveStatus: { id1: {} },
    dashboards: { id1: { name: 'dashboard1', _id: 'id1' } },
  },
};

const initialDashboardState = {
  charts: [
    {
      chartType: 'lineChart',
      config: {
        chartName: 'chart name',
        dataSource: 'id2',
        xAxis: 'column1',
        yAxis: [
          {
            name: 'column2',
          },
        ],
      },
      layout: {
        h: 2,
        i: 'widget-0',
        w: 6,
        x: 0,
        y: Infinity,
      },
    },
  ],
  count: 1,
  dashboardId: 'id1',
  layout: [],
  name: 'dashboard1',
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn().mockImplementation((selector) => selector(mockState)),
}));

describe('<Dashboard />', () => {
  const DashboardWithProviders = withRouter(withThemeProvider(withProjectLayout(Dashboard)));
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setTimeout(10000);
  });
  afterEach(() => {
    jest.clearAllTimers();
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
    fireEvent.input(chartNameInput, {
      target: { value: 'chart name' },
    });
    await selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    await selectDropDownOption(renderedComponent, 'x-axis-dropdown', 'column1');
    await selectDropDownOption(renderedComponent, 'y-axis-dropdown-0', 'column2');

    const applyButton = getByText('Apply').closest('button');

    await waitFor(() => expect(applyButton).not.toBeDisabled());

    await act(async () => {
      fireEvent.click(applyButton);
    });
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

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FETCH_DASHBOARD', id: 'id1' });
  });

  it('should fetch dashboard only when dashboard id is present', async () => {
    const DashboardWithCustomProviders = withRouter(
      withThemeProvider(() => (
        <ProjectLayoutProvider
          value={{
            projectMetadata: {
              id: '1',
              name: 'project1',
            },
            selectedDashboardMetadata: {},
            addDashboard: jest.fn(),
            deleteDashboard: jest.fn(),
          }}
        >
          <Dashboard />
        </ProjectLayoutProvider>
      )),
    );

    render(<DashboardWithCustomProviders />);

    await act(async () => {
      expect(api.getDashboard).not.toHaveBeenCalled();
    });
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

  describe('auto save', () => {
    it('should add chart and auto save', async () => {
      const renderedComponent = rtlRender(<DashboardWithProviders />);
      const { findByText } = renderedComponent;

      await findByText('dashboard1');

      await addChart(renderedComponent);

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: 'UPDATE_DASHBOARD',
          payload: { dashboard: initialDashboardState },
        }),
      );
    });

    it('should edit chart and auto save', async () => {
      const mockNewState = {
        dashboards: {
          autoSaveStatus: { id1: {} },
          dashboards: { id1: initialDashboardState },
        },
      };
      useSelector.mockImplementation((selector) => selector(mockNewState));
      const renderedComponent = rtlRender(<DashboardWithProviders />);
      const { getByText, findByText, getByTestId, getByLabelText } = renderedComponent;

      await findByText('dashboard1');

      fireEvent.click(getByTestId('widget-menu'));

      fireEvent.click(getByText('Configure Chart'));

      const chartNameInput = getByLabelText('Add chart name');
      await act(async () => {
        fireEvent.input(chartNameInput, {
          target: { value: 'edited chart name' },
        });
      });

      const applyButton = getByText('Apply').closest('button');

      await waitFor(() => expect(applyButton).not.toBeDisabled());

      await act(async () => {
        fireEvent.click(applyButton);
      });

      const expectedState = initialDashboardState;
      expectedState.charts[0].config.chartName = 'edited chart name';
      expectedState.count = 2;

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: 'UPDATE_DASHBOARD',
          payload: { dashboard: { ...expectedState } },
        }),
      );
    });

    it('should show error if any while saving the dashboard', async () => {
      const mockNewState = {
        dashboards: {
          autoSaveStatus: { id1: { saving: false, error: true, lastSaved: new Date() } },
          dashboards: { id1: initialDashboardState },
        },
      };
      useSelector.mockImplementation((selector) => selector(mockNewState));

      const renderedComponent = render(<DashboardWithProviders />);
      const { getByText, findByText } = renderedComponent;

      await findByText('dashboard1');

      expect(getByText('Unable to save the dashboard')).toBeInTheDocument();
    });
    it('should show saving state while saving the dashboard', async () => {
      const mockNewState = {
        dashboards: {
          autoSaveStatus: { id1: { saving: true, error: false, lastSaved: null } },
          dashboards: { id1: initialDashboardState },
        },
      };
      useSelector.mockImplementation((selector) => selector(mockNewState));

      const renderedComponent = render(<DashboardWithProviders />);
      const { getByText, findByText } = renderedComponent;

      await findByText('dashboard1');

      expect(getByText('Saving...')).toBeInTheDocument();
    });
    it('should call retry action on click of retry button if  any error while saving the dashboard', async () => {
      const mockNewState = {
        dashboards: {
          autoSaveStatus: { id1: { saving: false, error: true, lastSaved: new Date() } },
          dashboards: { id1: initialDashboardState },
        },
      };
      useSelector.mockImplementation((selector) => selector(mockNewState));

      const renderedComponent = render(<DashboardWithProviders />);
      const { getByText, findByText } = renderedComponent;

      await findByText('dashboard1');

      expect(getByText('Unable to save the dashboard')).toBeInTheDocument();

      const retryButton = getByText('Retry');
      fireEvent.click(retryButton);

      expect(mockDispatch).toHaveBeenLastCalledWith({
        type: 'UPDATE_DASHBOARD',
        payload: { dashboard: { ...initialDashboardState } },
      });
    });

    it('should delete the widget and autoSave', async () => {
      const mockNewState = {
        dashboards: {
          autoSaveStatus: { id1: {} },
          dashboards: { id1: initialDashboardState },
        },
      };
      useSelector.mockImplementation((selector) => selector(mockNewState));
      const renderedComponent = rtlRender(<DashboardWithProviders />);
      const { getByText, findByText, getByTestId } = renderedComponent;

      await findByText('dashboard1');

      fireEvent.click(getByTestId('widget-menu'));
      fireEvent.click(getByText('Delete Chart'));
      fireEvent.click(getByTestId('delete-chart-confirm'));

      expect(mockDispatch).toHaveBeenLastCalledWith({
        type: 'UPDATE_DASHBOARD',
        payload: {
          dashboard: {
            charts: [],
            count: 2,
            dashboardId: 'id1',
            layout: [],
            name: 'dashboard1',
          },
        },
      });
    });
  });
});
