import React from 'react';
import { fireEvent } from '@testing-library/dom';

import { renderWithRedux as render } from '../../../testUtil';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';
import Datasets from '../Datasets';
import withThemeProvider from '../../../theme/withThemeProvider';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
    deleteDatasource: jest.fn().mockResolvedValue({}),
    getAllDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        {
          createdAt: '2020-12-31T09:32:48.123Z',
          dashboardId: 'dashboardId',
          dashboardName: 'DashboardName',
          fileId: 'fileId',
          fileSize: 49440,
          fileType: 'fileType',
          name: 'fileName',
          dashboardUsage: 1,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          projectId: 'projectId',
          projectName: 'ProjectName',
          updatedAt: '2020-12-31T09:32:48.123Z',
          _id: 'DatasourceId',
        },
        {
          createdAt: '2020-12-31T09:32:48.123Z',
          fileId: 'fileId',
          fileSize: 49440,
          fileType: 'fileTyp2e',
          name: 'fileName2',
          dashboardUsage: 0,
          usage: [],
          updatedAt: '2020-12-31T09:32:48.123Z',
          _id: 'DatasourceId2',
        },
        {
          createdAt: '2020-12-31T09:32:48.123Z',
          dashboardId: 'dashboardId',
          dashboardName: 'DashboardName',
          fileId: 'fileId',
          fileSize: 49440,
          fileType: 'fileType',
          name: 'fileName3',
          dashboardUsage: 3,
          usage: [{ project: { name: 'project1', id: 1 }, dashboards: ['dashboard2'] }],
          projectId: 'projectId',
          projectName: 'ProjectName',
          updatedAt: '2020-12-31T09:32:48.123Z',
          _id: 'DatasourceId',
        },
      ],
    }),
  },
}));

describe('Datasets', () => {
  const DatasetsWithProvider = withThemeProvider(withSnackBar(Datasets));
  it('should match snapshot Datasets library', async () => {
    const { container, findByText } = render(<DatasetsWithProvider />);
    await findByText('fileName');
    expect(container).toMatchSnapshot();
  });

  it(
    'should open delete confirmation modal on click of delete icon and delete ' +
      'datasource on confirmation button click',
    async () => {
      const { findByText, getAllByTitle, getByText, getByTestId } = render(
        <DatasetsWithProvider />,
      );
      await findByText('fileName');
      const deleteButton = getAllByTitle('Delete Datasource');
      fireEvent.click(deleteButton[1]);
      const deleteConfirmationMessage = getByText(
        'Are you sure you want to delete datasource fileName2 ?',
      );
      expect(deleteConfirmationMessage).toBeInTheDocument();

      const confirmDeleteButton = getByTestId('delete-datasource');
      fireEvent.click(confirmDeleteButton);
      await findByText('fileName');

      const deletedMessage = getByText('Successfully deleted datasource fileName2');
      expect(api.deleteDatasource).toHaveBeenCalledWith('DatasourceId2');
      expect(deletedMessage).toBeInTheDocument();
    },
  );
  it('should enable delete only for usage count more than 0', async () => {
    const { findByText, getAllByTitle } = render(<DatasetsWithProvider />);
    await findByText('fileName');
    const deleteButton = getAllByTitle('Delete Datasource');

    expect(deleteButton[1].children[0]).not.toHaveAttribute('disabled');
    expect(deleteButton[0].children[0]).toHaveAttribute('disabled', '');
    expect(deleteButton[2].children[0]).toHaveAttribute('disabled', '');
  });

  it('should show message No Datasource Found if no dataSources are uploaded', async () => {
    api.getAllDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { findByText, getByText } = render(<DatasetsWithProvider />);
    await findByText('No Datasource Found');
    expect(getByText('No Datasource Found')).toBeInTheDocument();
  });
});
