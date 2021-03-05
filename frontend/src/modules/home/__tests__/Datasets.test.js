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
          usage: 1,
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
          usage: 0,
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
          usage: 3,
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

  it('should call delete on click on delete icon', async () => {
    const { findByText, getAllByRole } = render(<DatasetsWithProvider />);
    await findByText('fileName');
    const deleteButton = getAllByRole('button');
    fireEvent.click(deleteButton[1]);
    await findByText('fileName');
    expect(api.deleteDatasource).toHaveBeenCalledWith('DatasourceId2');
  });

  it('should delete row on click of delete icon', async () => {
    const { findByText, getAllByRole, queryByText } = render(<DatasetsWithProvider />);
    await findByText('fileName');
    const deleteButton = getAllByRole('button');
    fireEvent.click(deleteButton[1]);
    await findByText('fileName');

    expect(queryByText('fileName2')).toBeNull();
  });

  it('should show message No Datasource Found if no dataSources are uploaded', async () => {
    api.getAllDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { findByText, getByText } = render(<DatasetsWithProvider />);
    await findByText('No Datasource Found');
    expect(getByText('No Datasource Found')).toBeInTheDocument();
  });
});
