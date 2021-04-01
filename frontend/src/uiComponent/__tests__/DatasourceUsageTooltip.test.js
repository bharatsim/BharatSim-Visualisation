import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import DatasourceUsageTooltip from '../DatasourceUsageTooltip';
import withThemeProvider from '../../theme/withThemeProvider';

describe('<DatasourceUsageTooltip />', () => {
  const DatasourceUsageTooltipWithProvider = withThemeProvider(DatasourceUsageTooltip);
  it('should match snapshot', async () => {
    const { getByText, findByText } = render(
      <DatasourceUsageTooltipWithProvider
        usage={[
          { project: { name: 'project1', id: 1 }, dashboards: ['dashboard1', 'dashboard2'] },
          { project: { name: 'project2', id: 2 }, dashboards: ['dashboard3'] },
        ]}
        dashboardUsage={3}
      />,
    );

    fireEvent.mouseOver(getByText('3'));

    expect(await findByText('dashboard1, dashboard2')).toBeInTheDocument();
  });
});
