import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { renderWithRedux as render } from '../../../../testUtil';
import DashboardNavbar from '../sideDashboardNavbar/DashboardNavbar';
import withThemeProvider from '../../../../theme/withThemeProvider';
import withSnackBar from '../../../../hoc/snackbar/withSnackBar';
import withOverlayLoaderOrError from '../../../../hoc/loaderWithError/withOverlayLoaderOrError';
import { api } from '../../../../utils/api';
import { ProjectLayoutProvider } from '../../../../contexts/projectLayoutContext';

jest.mock('../../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({ dataSources: [{ _id: 'datasourceId' }] }),
    deleteDashboard: jest.fn().mockResolvedValue({ deleted: 1 }),
    deleteDatasources: jest.fn().mockResolvedValue({ deleted: 2 }),
  },
}));

describe('Dashboard Navbar', () => {
  const DashboardNavbarWithTheme = withOverlayLoaderOrError(
    withThemeProvider(withSnackBar(withSnackBar(DashboardNavbar))),
  );
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard view for given dashboard data and project name ', () => {
    const { container } = render(
      <DashboardNavbarWithTheme
        value={0}
        handleChange={() => {}}
        navItems={[{ name: 'dashboard1', _id: '0' }]}
        setNavTab={jest.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('should change the selected dashboard on click of another dashboard from navbar', () => {
    const setNavTabMock = jest.fn();
    const { getByTestId } = render(
      <DashboardNavbarWithTheme
        value={0}
        handleChange={() => {}}
        navItems={[
          { name: 'dashboard1', _id: '0' },
          { name: 'dashboard2', _id: '1' },
        ]}
        setNavTab={setNavTabMock}
      />,
    );
    const secondDashboard = getByTestId('tab-1');
    fireEvent.click(secondDashboard);

    expect(setNavTabMock).toHaveBeenLastCalledWith(1);
  });
  it('should open create dashboard modal on click of + button on dashboard navbar', () => {
    const setNavTabMock = jest.fn();
    const { getByTestId, getByText } = render(
      <DashboardNavbarWithTheme
        value={0}
        handleChange={() => {}}
        navItems={[
          { name: 'dashboard1', _id: '0' },
          { name: 'dashboard2', _id: '1' },
        ]}
        setNavTab={setNavTabMock}
      />,
    );
    const addIcon = getByTestId('add-dashboard-button');

    fireEvent.click(addIcon);

    const modalComponent = getByText('Specify the name of the project');

    expect(modalComponent).toBeInTheDocument();
  });

  describe('should delete selected dashboard on click of delete button on delete confirmation modal ', () => {
    const deleteDashboardMock = jest.fn();
    const Component = () => (
      <ProjectLayoutProvider
        value={{
          deleteDashboard: deleteDashboardMock,
        }}
      >
        <DashboardNavbarWithTheme
          value={0}
          handleChange={() => {}}
          navItems={[
            { name: 'dashboard1', _id: 'dashboardId0' },
            { name: 'dashboard2', _id: 'dashboardId1' },
          ]}
          setNavTab={jest.fn()}
        />
      </ProjectLayoutProvider>
    );
    it('should call delete dashboard with selected dashboard id', async () => {
      const { getByAltText, getByTestId, findByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(api.deleteDashboard).toHaveBeenCalledWith('dashboardId0');
    });
    it('should show error if datasource file for dashboard deletion fail', async () => {
      api.getDatasources.mockResolvedValue({ dataSources: [{ _id: 'datasourceId' }] });
      api.deleteDatasources.mockImplementationOnce(() => Promise.reject());

      const { getByAltText, getByTestId, findByText, getByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);
      await findByText('Aw Snap! Failed to delete datasource file for dashboard dashboard1');
      expect(
        getByText('Aw Snap! Failed to delete datasource file for dashboard dashboard1'),
      ).toBeInTheDocument();
    });
    it('should call delete datasource for dashboard with selected dashboard id', async () => {
      const { getByAltText, getByTestId, findByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(api.deleteDatasources).toHaveBeenCalledWith(['datasourceId']);
    });

    it('should delete dashboard from context', async () => {
      const { getByAltText, getByTestId, findByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(deleteDashboardMock).toHaveBeenCalledWith('dashboardId0');
    });

    it('should show snack bar for successful deletion of dashboard and file', async () => {
      const { getByAltText, getByTestId, findByText, getByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(getByText('Dashboard dashboard1 Deleted successfully')).toBeInTheDocument();

      await findByText('Datasource files for Dashboard dashboard1 Deleted successfully');

      expect(
        getByText('Datasource files for Dashboard dashboard1 Deleted successfully'),
      ).toBeInTheDocument();
    });

    it('should not show snack bar for successful deletion datasources if files are not present', async () => {
      api.deleteDatasources.mockResolvedValueOnce({ delete: 0 });
      api.getDatasources.mockResolvedValueOnce({ dataSources: [] });
      const { getByAltText, getByTestId, findByText, queryByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(
        queryByText('Datasource files for Dashboard dashboard1 Deleted successfully'),
      ).not.toBeInTheDocument();
    });
    it('should not delete the datasource files if radio button is set to No on delete confirmation modal', async () => {
      api.deleteDatasources.mockResolvedValueOnce({ delete: 0 });
      const { getByAltText, getByTestId, findByText, queryByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      const NoRadioButton = getByTestId('no-radio-button');
      fireEvent.click(NoRadioButton);
      fireEvent.click(deleteButton);
      await findByText('Dashboard dashboard1 Deleted successfully');
      expect(
        queryByText('Datasource files for Dashboard dashboard1 Deleted successfully'),
      ).not.toBeInTheDocument();
    });
    it('should show error if dashboard deletion fail', async () => {
      api.deleteDashboard.mockRejectedValueOnce();
      const { getByAltText, getByTestId, findByText, getByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Aw Snap! Failed to delete dashboard dashboard1');

      expect(getByText('Aw Snap! Failed to delete dashboard dashboard1')).toBeInTheDocument();
      await waitFor(() => {});
    });
  });
});
