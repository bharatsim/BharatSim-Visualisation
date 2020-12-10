import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import * as router from 'react-router-dom';
import { fireEvent } from '@testing-library/dom';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';
import ProjectLayout from '../projectLayout/ProjectLayout';
import { projectLayoutContext } from '../../../../contexts/projectLayoutContext';
import withSnackBar from '../../../../hoc/withSnackBar';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

function DummyComponent() {
  const { projectMetadata, selectedDashboardMetadata, addDashboard } = useContext(
    projectLayoutContext,
  );
  return (
    <div>
      <div>ProjectLayout Child</div>
      <button onClick={() => addDashboard({ _id: 'id', name: 'dashboard-name' })} type="button">
        add dashboard
      </button>
      {JSON.stringify({ projectMetadata, selectedDashboardMetadata }, null, 2)}
    </div>
  );
}

jest.mock('../../../../utils/api', () => ({
  api: {
    getProject: jest.fn().mockResolvedValue({ project: { name: 'name', _id: 'id' } }),
    deleteDashboard: jest.fn().mockResolvedValue({}),
    deleteDatasourceForDashboard: jest.fn().mockResolvedValue({}),
    getAllDashBoardByProjectId: jest.fn().mockResolvedValue({
      dashboards: [
        { name: 'dashboardName1', _id: 'dashboardId1' },
        { name: 'dashboardName2', _id: 'dashboardId2' },
      ],
    }),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

describe('Project', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const Component = withSnackBar(
    withThemeProvider(() => (
      <ProjectLayout>
        <DummyComponent />
      </ProjectLayout>
    )),
  );

  it('should render child without any api call if project id is undefined', async () => {
    router.useParams.mockReturnValue({ id: undefined });

    const { container } = render(<Component />);

    expect(container).toMatchSnapshot();
  });

  it('should render child with api call if project id is present', async () => {
    router.useParams.mockReturnValue({ id: 1 });
    api.getProject.mockResolvedValue({ project: { _id: 1, name: 'project1' } });

    const { findByText } = render(<Component />);

    await findByText('ProjectLayout Child');

    expect(api.getAllDashBoardByProjectId).toHaveBeenCalledWith(1);
    expect(api.getProject).toHaveBeenCalledWith(1);
  });

  it('should create tab for dashboard in sidebar panel', async () => {
    router.useParams.mockReturnValue({ id: 1 });
    api.getProject.mockResolvedValue({ project: { _id: 1, name: 'project1' } });

    const { findByText } = render(<Component />);
    await findByText('ProjectLayout Child');

    expect(await findByText('dashboardName1')).not.toBeNull();
  });

  it('should navigate to create dashboard page if dashboards are empty', async () => {
    router.useParams.mockReturnValue({ id: 1 });
    api.getAllDashBoardByProjectId.mockResolvedValueOnce({ dashboards: [] });

    const { findByText } = render(<Component />);

    await findByText('ProjectLayout Child');

    expect(mockHistoryReplace).toHaveBeenCalledWith({ pathname: '/projects/1/create-dashboard' });
  });

  it('should create tab for dashboard in sidebar panel on click of add dashboard', async () => {
    router.useParams.mockReturnValue({ id: 1 });

    const { getByText, findByText } = render(<Component />);

    await findByText('ProjectLayout Child');

    fireEvent.click(getByText('add dashboard'));

    expect(getByText('dashboard-name')).not.toBeNull();
  });

  it('should delete tab on click of delete button of selected tab', async () => {
    router.useParams.mockReturnValue({ id: 1 });

    const { getByText, findByText, getByAltText, getByTestId } = render(<Component />);

    await findByText('ProjectLayout Child');

    fireEvent.click(getByText('dashboardName2'));

    const optionsIcon = getByAltText('options-logo');
    fireEvent.click(optionsIcon);

    const deleteOption = getByTestId('delete-option-dashboardId2');
    fireEvent.click(deleteOption);

    const deleteButton = getByTestId('delete-dashboard-button');
    fireEvent.click(deleteButton);

    await findByText('Dashboard dashboardName2 Deleted successfully');

    expect(getByText('Dashboard dashboardName2 Deleted successfully')).toBeInTheDocument();
  });
});
