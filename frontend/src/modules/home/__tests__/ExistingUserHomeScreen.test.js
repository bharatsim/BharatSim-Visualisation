import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { renderWithRedux as render } from '../../../testUtil';
import ExistingUserHomeScreen from '../ExistingUserHomeScreen';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';
import { api } from '../../../utils/api';
import withThemeProvider from '../../../theme/withThemeProvider';
import withOverlayLoaderOrError from '../../../hoc/loaderWithError/withOverlayLoaderOrError';

jest.mock('../../../utils/api', () => ({
  api: {
    deleteProject: jest.fn().mockResolvedValue({
      deleted: 1,
    }),
    getDatasourcesForProject: jest.fn().mockResolvedValue({
      dataSources: [{ _id: 'datasourceId' }],
    }),
    getAllDatasources: jest.fn().mockResolvedValue({
      dataSources: [{ _id: 'datasourceId', name: 'fileName' }],
    }),
    deleteDatasource: jest.fn().mockResolvedValue({ deleted: 1 }),
  },
}));
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Existing User Home Screen', () => {
  const ExistingUserHomeScreenWithProviders = withOverlayLoaderOrError(
    withThemeProvider(withSnackBar(ExistingUserHomeScreen)),
  );
  it('should match snapshot for given projects', () => {
    const { container } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: '1', name: 'project1' }]}
        setRecentProjects={jest.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('should navigate to datesets library on click of datasets tab', async () => {
    const { getByText, findByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: '1', name: 'project1' }]}
        setRecentProjects={jest.fn()}
      />,
    );
    const datasetsTabButton = getByText('Datasets');
    fireEvent.click(datasetsTabButton);
    await findByText('fileName');
    expect(getByText('fileName')).toBeInTheDocument();
  });
  it('should navigate to project on click of project card', () => {
    const { getByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: '1', name: 'project1' }]}
        setRecentProjects={jest.fn()}
      />,
    );

    fireEvent.click(getByText('project1'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/1/dashboard');
  });
  it('should create new project on click of add new button', () => {
    const { getByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: '1', name: 'project1' }]}
        setRecentProjects={jest.fn()}
      />,
    );

    fireEvent.click(getByText('Add New'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/create');
  });
  // TODO: Update test after delete datasource implemented
  it('should delete project on click of delete option', async () => {
    const mockSetRecentProject = jest.fn();
    const { getByTestId, findByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: 'projectId', name: 'projectName' }]}
        setRecentProjects={mockSetRecentProject}
      />,
    );
    const projectMenuButton = getByTestId('project-menu');
    fireEvent.click(projectMenuButton);

    const deleteOptionForProject1 = getByTestId('delete-project-projectId');
    fireEvent.click(deleteOptionForProject1);

    const deleteProjectConfirmationButton = getByTestId('delete-project-confirmation-button');
    fireEvent.click(deleteProjectConfirmationButton);

    await findByText('Project projectName deleted successfully');

    expect(mockSetRecentProject).toHaveBeenCalledWith([]);
    expect(api.deleteProject).toHaveBeenCalledWith('projectId');
  });
  it('should show error if any while deleting project', async () => {
    const mockSetRecentProject = jest.fn();
    api.deleteProject.mockRejectedValueOnce();
    const { getByTestId, findByText, getByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: 'projectId', name: 'projectName' }]}
        setRecentProjects={mockSetRecentProject}
      />,
    );
    const projectMenuButton = getByTestId('project-menu');
    fireEvent.click(projectMenuButton);

    const deleteOptionForProject1 = getByTestId('delete-project-projectId');
    fireEvent.click(deleteOptionForProject1);

    const deleteProjectConfirmationButton = getByTestId('delete-project-confirmation-button');
    fireEvent.click(deleteProjectConfirmationButton);

    await findByText('Aw Snap! Failed to delete project projectName');

    expect(getByText('Aw Snap! Failed to delete project projectName')).toBeInTheDocument();
  });
  it('should show error if any while deleting datasources for project', async () => {
    const mockSetRecentProject = jest.fn();
    api.deleteDatasource.mockRejectedValueOnce();
    const { getByTestId, findByText, getByText } = render(
      <ExistingUserHomeScreenWithProviders
        recentProjects={[{ _id: 'projectId', name: 'projectName' }]}
        setRecentProjects={mockSetRecentProject}
      />,
    );
    const projectMenuButton = getByTestId('project-menu');
    fireEvent.click(projectMenuButton);

    const deleteOptionForProject1 = getByTestId('delete-project-projectId');
    fireEvent.click(deleteOptionForProject1);

    const deleteProjectConfirmationButton = getByTestId('delete-project-confirmation-button');
    fireEvent.click(deleteProjectConfirmationButton);

    await findByText('Aw Snap! Failed to delete datasource file for project projectName');

    expect(
      getByText('Aw Snap! Failed to delete datasource file for project projectName'),
    ).toBeInTheDocument();
  });
  it(
    'should not delete the datasources associated with project id ' +
      'on click of no from confirmation modal',
    async () => {
      const mockSetRecentProject = jest.fn();
      const { getByTestId, findByText, getByText } = render(
        <ExistingUserHomeScreenWithProviders
          recentProjects={[{ _id: 'projectId', name: 'projectName' }]}
          setRecentProjects={mockSetRecentProject}
        />,
      );
      const projectMenuButton = getByTestId('project-menu');
      fireEvent.click(projectMenuButton);

      const deleteOptionForProject1 = getByTestId('delete-project-projectId');
      fireEvent.click(deleteOptionForProject1);

      const NoRadioButton = getByTestId('no-radio-button');
      fireEvent.click(NoRadioButton);

      const deleteProjectConfirmationButton = getByTestId('delete-project-confirmation-button');
      fireEvent.click(deleteProjectConfirmationButton);

      await findByText('Project projectName deleted successfully');

      expect(getByText('Project projectName deleted successfully')).toBeInTheDocument();
    },
  );
  it(
    'should not delete the datasources associated with project' +
      ' id if datasources are not present',
    async () => {
      const mockSetRecentProject = jest.fn();
      api.getDatasourcesForProject.mockResolvedValue({
        dataSources: [],
      });
      const { getByTestId, findByText, getByText } = render(
        <ExistingUserHomeScreenWithProviders
          recentProjects={[{ _id: 'projectId', name: 'projectName' }]}
          setRecentProjects={mockSetRecentProject}
        />,
      );
      const projectMenuButton = getByTestId('project-menu');
      fireEvent.click(projectMenuButton);

      const deleteOptionForProject1 = getByTestId('delete-project-projectId');
      fireEvent.click(deleteOptionForProject1);

      const deleteProjectConfirmationButton = getByTestId('delete-project-confirmation-button');
      fireEvent.click(deleteProjectConfirmationButton);

      await findByText('Project projectName deleted successfully');

      expect(getByText('Project projectName deleted successfully')).toBeInTheDocument();
    },
  );
});
