import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { fireEvent, within } from '@testing-library/dom';
import { createMemoryHistory } from 'history';

import ManageDataset from '../ManageDataset';
import withThemeProvider from '../../../theme/withThemeProvider';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';
import { api } from '../../../utils/api';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

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
          fileType: 'csv',
          name: 'csv-file-name',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180df',
        },
      ],
    }),
    getAllDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180df',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-2',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180pq',
        },
        {
          createdAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          dashboardId: '5f9952ede93dbd234a39d82f',
          fileSize: 125005,
          fileType: 'csv',
          name: 'csv-file-name-3',
          updatedAt: 'Fri Oct 20 2020 15:45:07 GMT+0530',
          _id: '5f9a88952629222105e180rs',
        },
      ],
    }),
  },
}));

const history = createMemoryHistory();

const ComponentWithProvider = withThemeProvider(() => (
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
));

describe('Configure datasets', () => {
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

  it('add and remove datasource from dashboard flow', async () => {
    const { getByText, findByText, getAllByText, getAllByTitle } = render(
      <ComponentWithProvider />,
    );
    await findByText('Configure Dashboard Data');
    await findByText('Dataset Library');

    const commonFileFromGlobalDataset = getAllByText('csv-file-name')[1];
    const rowOfCommonFile = within(commonFileFromGlobalDataset.parentNode);

    // should checkbox for common file should be disable and checked
    expect(rowOfCommonFile.getByRole('checkbox')).toHaveAttribute('checked', '');
    expect(rowOfCommonFile.getByRole('checkbox')).toHaveAttribute('disabled', '');

    // should global file name should be present only one time before adding to dashboard
    expect(getAllByText('csv-file-name-2').length).toBe(1);
    const fileName = getByText('csv-file-name-2');
    const rowOfFile = within(fileName.parentNode);

    // should select csv-file-name-2 to add in dashboard
    rowOfFile.getByRole('checkbox').click();
    fireEvent.change(rowOfFile.getByRole('checkbox'), { target: { checked: true } });

    // should make selected count 1
    expect(getByText('1 item(s) selected'));

    // should add selected file
    fireEvent.click(getByText('Add to dashboard'));
    expect(getAllByText('csv-file-name-2').length).toBe(2);

    // should unchecked datasources in global dataset and make selected count zero
    expect(getByText('0 item(s) selected'));

    // remove added file from dashboard
    const removeButtonForSecondRow = getAllByTitle('Remove datasource from dashboard')[1];

    fireEvent.click(removeButtonForSecondRow);

    expect(getAllByText('csv-file-name-2').length).toBe(1);
  });
});
