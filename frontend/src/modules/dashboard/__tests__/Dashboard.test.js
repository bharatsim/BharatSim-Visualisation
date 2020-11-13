import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Dashboard from '../Dashboard';
import withThemeProvider from '../../../theme/withThemeProvider';
import { ProjectLayoutProvider } from '../../../contexts/projectLayoutContext';

describe('<Dashboard />', () => {
  const DashboardWithProviders = withThemeProvider(() => (
    <ProjectLayoutProvider
      value={{
        selectedDashboardMetadata: {
          name: 'dashboardName',
        },
        projectMetadata: { name: 'project1' },
      }}
    >
      <Dashboard />
    </ProjectLayoutProvider>
  ));
  it('should add dashboard name to dashboard component', () => {
    const { getByText } = render(<DashboardWithProviders />);

    const dashboardName = getByText('dashboardName');

    expect(dashboardName).toBeInTheDocument();
  });

  it('should open side wizard on click of add chart', () => {
    const { getByText } = render(<DashboardWithProviders />);

    const addChartButton = getByText('Add Chart');

    fireEvent.click(addChartButton);

    expect(getByText('Chart Configuration Wizard')).toBeInTheDocument();
  });

  it('should close modal on click of close icon', () => {
    const { getByText, queryByText, getByTestId } = render(<DashboardWithProviders />);

    const addChartButton = getByText('Add Chart');

    fireEvent.click(addChartButton);

    const closeIconButton = getByTestId('close-wizard');

    fireEvent.click(closeIconButton);

    expect(queryByText('Chart Configuration Wizard')).not.toBeInTheDocument();
  });
});
