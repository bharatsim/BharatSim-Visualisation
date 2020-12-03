import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DashboardNavbar from '../sideDashboardNavbar/DashboardNavbar';
import withThemeProvider from '../../../../theme/withThemeProvider';
import withSnackBar from '../../../../hoc/withSnackBar';

describe('Dashboard Navbar', () => {
  const DashboardNavbarWithTheme = withSnackBar(withThemeProvider(DashboardNavbar));
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
});
