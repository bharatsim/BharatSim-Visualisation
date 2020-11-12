import React from 'react';
import { render } from '@testing-library/react';
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
});
