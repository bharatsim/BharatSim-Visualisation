import React from 'react';
import { renderWithRedux as render } from '../../../testUtil';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';
import Datasets from '../Datasets';
import withThemeProvider from '../../../theme/withThemeProvider';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
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
          name: 'fileName',
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
  it('should show message No Datasource Found if no dataSources are uploaded', async () => {
    api.getAllDatasources.mockResolvedValueOnce({ dataSources: [] });
    const { findByText, getByText } = render(<DatasetsWithProvider />);
    await findByText('No Datasource Found');
    expect(getByText('No Datasource Found')).toBeInTheDocument();
  });
});
