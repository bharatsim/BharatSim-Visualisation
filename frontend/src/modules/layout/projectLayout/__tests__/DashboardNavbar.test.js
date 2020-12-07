import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DashboardNavbar from '../sideDashboardNavbar/DashboardNavbar';
import withThemeProvider from '../../../../theme/withThemeProvider';
import withSnackBar from '../../../../hoc/withSnackBar';
import withOverlayLoaderOrError from '../../../../hoc/withOverlayLoaderOrError';
import { api } from '../../../../utils/api';
import { ProjectLayoutProvider } from '../../../../contexts/projectLayoutContext';

jest.mock('../../../../utils/api', () => ({
  api: {
    deleteDashboard: jest.fn().mockResolvedValue({ deleted: 1 }),
  },
}));

describe('Dashboard Navbar', () => {
  const DashboardNavbarWithTheme = withOverlayLoaderOrError(
    withSnackBar(withThemeProvider(DashboardNavbar)),
  );

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
    it('should call delete dashboard with selected dashboard id', () => {
      const { getByAltText, getByTestId } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      expect(api.deleteDashboard).toHaveBeenCalledWith('dashboardId0');
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

    it('should show snack bar for successful deletion of dashboard', async () => {
      const { getByAltText, getByTestId, findByText, getByText } = render(<Component />);
      const optionsIcon = getByAltText('options-logo');
      fireEvent.click(optionsIcon);

      const deleteOption = getByTestId('delete-option-dashboardId0');
      fireEvent.click(deleteOption);

      const deleteButton = getByTestId('delete-dashboard-button');
      fireEvent.click(deleteButton);

      await findByText('Dashboard dashboard1 Deleted successfully');

      expect(getByText('Dashboard dashboard1 Deleted successfully')).toBeInTheDocument();
    });
  });
});
