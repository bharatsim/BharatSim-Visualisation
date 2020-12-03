import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import ProjectHomeScreen from '../ProjectHomeScreen';
import withThemeProvider from '../../../theme/withThemeProvider';
import { api } from '../../../utils/api';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';
import withOverlayLoaderOrError from '../../../hoc/withOverlayLoaderOrError';

jest.mock('../../../utils/api', () => ({
  api: {
    saveProject: jest.fn().mockResolvedValue({ projectId: 'projectId' }),
    addNewDashboard: jest.fn().mockResolvedValue({ _id: 'dashboardId' }),
  },
}));

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
const mockAddDashboard = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

function openFillAndSubmitNewProjectForm(renderedComponent) {
  const { getByText } = renderedComponent;
  fireEvent.click(getByText('Click here to create your first dashboard.'));

  const container = within(document.querySelector('.MuiPaper-root'));

  fireEvent.change(container.getByLabelText('Dashboard Title'), {
    target: { value: 'DashboardName' },
  });
  fireEvent.change(container.getByLabelText('Project Title'), {
    target: { value: 'ProjectName' },
  });

  fireEvent.click(container.getByText('create'));
}

describe('<ProjectHomeScreenComponent />', () => {
  let ProjectHomeScreenComponent;
  beforeEach(() => {
    ProjectHomeScreenComponent = withThemeProvider(
      withOverlayLoaderOrError(() => (
        <SnackbarProvider>
          <ProjectLayoutProvider
            value={{
              projectMetadata: {
                name: '',
              },
              selectedDashboardMetadata: {
                name: '',
              },
              addDashboard: mockAddDashboard,
            }}
          >
            <ProjectHomeScreen />
          </ProjectLayoutProvider>
        </SnackbarProvider>
      )),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = render(<ProjectHomeScreenComponent />);

    expect(container).toMatchSnapshot();
  });

  it('should open new dashboard popup onclick of card', () => {
    const { getByText } = render(<ProjectHomeScreenComponent />);
    fireEvent.click(getByText('Click here to create your first dashboard.'));

    const container = within(document.querySelector('.MuiPaper-root'));

    expect(container.queryByText('New Dashboard')).toBeInTheDocument();
  });

  it('should call create project api after click on create button with inputted data', async () => {
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('Project ProjectName is saved');

    expect(api.saveProject).toHaveBeenCalledWith({ name: 'ProjectName' });
  });

  it('should call create project api and dashboard api after click on create button with default data', async () => {
    const { getByText, findByText } = render(<ProjectHomeScreenComponent />);

    fireEvent.click(getByText('Click here to create your first dashboard.'));

    const container = within(document.querySelector('.MuiPaper-root'));

    fireEvent.click(container.getByText('create'));

    await findByText('Project Untitled Project is saved');

    expect(api.saveProject).toHaveBeenCalledWith({ name: 'Untitled Project' });
    expect(api.addNewDashboard).toHaveBeenCalledWith({
      name: 'Untitled Dashboard',
      projectId: 'projectId',
    });
  });

  it('should call create dashboard api after click on create button with inputted data and projectId ', async () => {
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('Dashboard DashboardName is saved');

    expect(api.addNewDashboard).toHaveBeenCalledWith({
      name: 'DashboardName',
      projectId: 'projectId',
    });
  });

  it('should add new dashboard to state', async () => {
    api.addNewDashboard.mockResolvedValue({ dashboardId: '123' });
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('Project ProjectName is saved');

    expect(mockAddDashboard).toHaveBeenCalledWith({
      _id: '123',
      name: 'DashboardName',
    });
  });

  it('should navigate to project page', async () => {
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('Project ProjectName is saved');

    expect(mockHistoryReplace).toHaveBeenCalledWith({
      pathname: '/projects/projectId/configure-dataset',
    });
  });

  it('should display snackbar for successful message for dashboard and project creation', async () => {
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    const component = await renderComponent.findByText('Project ProjectName is saved');

    expect(component).toBeInTheDocument();
  });

  it('should only call save dashboard api if project id is already present', async () => {
    const Component = withThemeProvider(() => (
      <SnackbarProvider>
        <ProjectLayoutProvider
          value={{
            projectMetadata: {
              name: 'Project 2',
              id: '1231241243123',
            },
            selectedDashboardMetadata: {
              name: '',
            },
            addDashboard: jest.fn(),
          }}
        >
          <ProjectHomeScreen />
        </ProjectLayoutProvider>
      </SnackbarProvider>
    ));
    const { getByText, findByText } = render(<Component />);

    fireEvent.click(getByText('Click here to create your first dashboard.'));

    const container = within(document.querySelector('.MuiPaper-root'));

    fireEvent.change(container.getByLabelText('Dashboard Title'), {
      target: { value: 'DashboardName' },
    });

    fireEvent.click(getByText('create'));

    await findByText('Dashboard DashboardName is saved');

    expect(api.addNewDashboard).toHaveBeenCalledWith({
      name: 'DashboardName',
      projectId: '1231241243123',
    });
  });

  it('should show error if adding project is failed', async () => {
    api.saveProject.mockRejectedValueOnce('error');
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText(
      'Aw Snap! Failed to create project ProjectName and dashboard DashboardName',
    );

    expect(
      renderComponent.getByText(
        'Aw Snap! Failed to create project ProjectName and dashboard DashboardName',
      ),
    ).toBeInTheDocument();
  });

  it('should show error if adding dashboard is failed', async () => {
    api.addNewDashboard.mockRejectedValueOnce('error');
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('Aw Snap! Failed to create dashboard DashboardName');

    expect(
      renderComponent.getByText('Aw Snap! Failed to create dashboard DashboardName'),
    ).toBeInTheDocument();
  });

  it('should navigate to create-dashboard url for dashboard creation failure', async () => {
    api.addNewDashboard.mockRejectedValueOnce('error');
    const renderComponent = render(<ProjectHomeScreenComponent />);

    openFillAndSubmitNewProjectForm(renderComponent);

    await renderComponent.findByText('technical error at server');

    expect(mockHistoryReplace).toHaveBeenCalledWith({
      pathname: '/projects/projectId/create-dashboard',
    });
  });

  it('should not navigate to create-dashboard url for dashboard creation failure project is already present', async () => {
    api.addNewDashboard.mockRejectedValueOnce('error');
    const Component = withThemeProvider(
      withOverlayLoaderOrError(() => (
        <SnackbarProvider>
          <ProjectLayoutProvider
            value={{
              projectMetadata: {
                name: 'Project 2',
                id: '1231241243123',
              },
              selectedDashboardMetadata: {
                name: '',
              },
              addDashboard: jest.fn(),
            }}
          >
            <ProjectHomeScreen />
          </ProjectLayoutProvider>
        </SnackbarProvider>
      )),
    );

    const renderComponent = render(<Component />);
    fireEvent.click(renderComponent.getByText('Click here to create your first dashboard.'));

    fireEvent.click(renderComponent.getByText('create'));

    await renderComponent.findByText('technical error at server');

    expect(mockHistoryReplace).not.toHaveBeenCalledWith({
      pathname: '/projects/projectId/create-dashboard',
    });
  });
});
