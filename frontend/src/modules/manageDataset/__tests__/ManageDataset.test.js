import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent, within } from '@testing-library/dom';
import { createMemoryHistory } from 'history';

import { renderWithRedux as render } from '../../../testUtil';
import ManageDataset from '../ManageDataset';
import withThemeProvider from '../../../theme/withThemeProvider';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';
import { api } from '../../../utils/api';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
jest.mock('../editDatasource/EditDatasourceModal', () => () => <div>Edit datasource modal</div>);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'json',
          name: 'csv-file-name',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardUsage: 1,
          widgetUsage: 1,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          _id: '5f9a88952629222105e180df',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-4',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardUsage: 0,
          widgetUsage: 0,
          usage: [],
          _id: '5f9a88952629222105e160df',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-5',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardUsage: 1,
          widgetUsage: 0,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          _id: '5f9a88952629222105e170df',
        },
      ],
    }),
    getAllDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'json',
          name: 'csv-file-name',
          dashboardUsage: 1,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180df',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-2',
          dashboardUsage: 1,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180pq',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-3',
          dashboardUsage: 1,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180rs',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-4',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardUsage: 0,
          widgetUsage: 0,
          usage: [],
          _id: '5f9a88952629222105e160df',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-5',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardUsage: 1,
          widgetUsage: 0,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          _id: '5f9a88952629222105e170df',
        },
      ],
    }),
    addDatasourceDashboardMaps: jest.fn().mockResolvedValue({}),
    removeDatasourceDashboardMaps: jest.fn().mockResolvedValue({}),
    deleteDatasource: jest.fn().mockResolvedValue({}),
  },
}));

const history = createMemoryHistory();

const ComponentWithProvider = withThemeProvider(
  withSnackBar(() => (
    <Router history={history}>
      <ProjectLayoutProvider
        value={{
          projectMetadata: { name: 'project1', id: '123' },
          selectedDashboardMetadata: { name: 'dashboard1', _id: 'selectedDashboardId' },
        }}
      >
        <ManageDataset />
      </ProjectLayoutProvider>
    </Router>
  )),
);

describe('Manage datasets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should show datasources for dashboard and global datasources', async () => {
    const { getAllByText, findByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    expect(getAllByText('csv-file-name').length).toBe(2);
  });

  it('should render configure dataset header with for given dashboard data and project name ', async () => {
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    expect(getByText('project1 :: dashboard1')).toBeInTheDocument();
  });

  it('should navigate to recent projects on click of back to recent button', async () => {
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    fireEvent.click(getByText('Back to recent projects'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });
  it('should navigate to dashboard page on click of go to dashboard button', async () => {
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    fireEvent.click(getByText('Go to dashboard'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/123/dashboard');
  });
  it('should navigate to upload data screen on click of upload dataset button', async () => {
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    fireEvent.click(getByText('Upload Data'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/projects/123/upload-dataset');
  });

  it('should navigate to upload data screen on click of upload dataset link', async () => {
    api.getDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    fireEvent.click(getByText('Upload dataset'));

    expect(history.location.pathname).toEqual('/projects/123/upload-dataset');
  });

  it('should display no datasource message if data sources are empty', async () => {
    api.getDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    expect(
      getByText('Before we can create any visualization, we ‘ll need some data.'),
    ).toBeInTheDocument();
  });

  it('should disable goToDashboard button if no datasource presents', async () => {
    api.getDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { getByText, findByText } = render(<ComponentWithProvider />);

    await findByText('Configure Dashboard Data');

    expect(getByText('Go to dashboard').closest('button')).toBeDisabled();
  });

  it('should checked and disable common file rows in dataset libraries', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const commonFileFromGlobalDataset = getAllByText('csv-file-name')[1];
    const rowOfCommonFile = within(commonFileFromGlobalDataset.parentNode);

    expect(rowOfCommonFile.getByRole('checkbox')).toHaveAttribute('checked', '');
    expect(rowOfCommonFile.getByRole('checkbox')).toHaveAttribute('disabled', '');
  });

  it('should have common file rows in both dashboard datasets and global datasets', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    expect(getAllByText('csv-file-name-4').length).toBe(2);
  });

  it('should have only one rows in global datasets if datasource is not added in dashboard', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    expect(getAllByText('csv-file-name-2').length).toBe(1);
  });

  it('add datasource from dashboard flow', async () => {
    const { getByText, findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const fileName = getByText('csv-file-name-2');
    const rowOfFile = within(fileName.parentNode);

    rowOfFile.getByRole('checkbox').click();
    fireEvent.change(rowOfFile.getByRole('checkbox'), { target: { checked: true } });

    expect(getByText('1 item(s) selected'));

    fireEvent.click(getByText('Add to dashboard'));

    await findByText('Successfully added selected datasources');

    expect(getAllByText('csv-file-name-2').length).toBe(2);

    // should unchecked datasources in global dataset and make selected count zero
    expect(getByText('0 item(s) selected'));
  });
  it('should disable remove button if widget count is more than 0', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const rowOneName = getAllByText('csv-file-name')[0];
    const rowOne = within(rowOneName.parentNode);

    const removeButton = rowOne.getByTitle('Remove datasource from dashboard').childNodes[0];

    expect(removeButton).toHaveAttribute('disabled', '');
  });

  it('should disable delet button if widget usage and dashboard usage count is more than 0', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const rowOneName = getAllByText('csv-file-name')[0];
    const rowOne = within(rowOneName.parentNode);

    const removeButton = rowOne.getByTitle('Delete Datasource').childNodes[0];

    expect(removeButton).toHaveAttribute('disabled', '');
  });

  it('should disable delete button if widget usage and dashboard usage count is more than 0', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const rowOneName = getAllByText('csv-file-name')[0];
    const rowOne = within(rowOneName.parentNode);

    const removeButton = rowOne.getByTitle('Delete Datasource').childNodes[0];

    expect(removeButton).toHaveAttribute('disabled', '');
  });

  it('delete datasource flow', async () => {
    const { findByText, getAllByText, getByText, queryByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    // present in both dashboard and datasets
    const file4 = getAllByText('csv-file-name-4');
    expect(file4.length).toBe(2);

    const file4NameFromDashboard = file4[0];
    const rowForFile4 = within(file4NameFromDashboard.parentNode);

    const deleteButton = rowForFile4.getByTitle('Delete Datasource');

    fireEvent.click(deleteButton);

    const deleteDatasourceButton = getByText('Delete data source');

    expect(deleteDatasourceButton).toBeInTheDocument();

    fireEvent.click(deleteDatasourceButton);

    await findByText('Successfully deleted csv-file-name-4 datasource');

    expect(api.deleteDatasource).toHaveBeenCalledWith('5f9a88952629222105e160df');

    expect(queryByText('csv-file-name-4')).toBeNull();
  });

  it('remove datasource flow', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    // present in both dashboard and datasets
    const file5 = getAllByText('csv-file-name-5');
    expect(file5.length).toBe(2);

    const file5NameFromDashboard = file5[0];
    const rowForFile5 = within(file5NameFromDashboard.parentNode);

    const removeButton = rowForFile5.getByTitle('Remove datasource from dashboard');

    fireEvent.click(removeButton);

    await findByText('Successfully removed csv-file-name-5 datasource from dashboard');

    expect(api.removeDatasourceDashboardMaps).toHaveBeenCalledWith({
      dashboardId: 'selectedDashboardId',
      datasourceId: '5f9a88952629222105e170df',
    });

    expect(getAllByText('csv-file-name-5').length).toBe(1);
  });

  it('should hide edit button if file type is not csv', async () => {
    const { findByText, getAllByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const rowOneName = getAllByText('csv-file-name')[0];
    const rowOne = within(rowOneName.parentNode);

    const removeButton = rowOne.queryByTitle('Edit datasource');

    expect(removeButton).toBeNull();
  });

  it('should open edit modal on click of edit button', async () => {
    const { findByText, getAllByText, queryByText } = render(<ComponentWithProvider />);
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const rowOneName = getAllByText('csv-file-name-4')[0];
    const rowOne = within(rowOneName.parentNode);

    const editButton = rowOne.queryByTitle('Edit datasource');

    fireEvent.click(editButton);

    expect(queryByText('Edit datasource modal')).toBeInTheDocument();
  });
});
