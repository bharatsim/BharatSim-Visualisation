import React from 'react';
import { render } from '@testing-library/react';
import { renderWidget } from '../renderWidget';
import withThemeProvider from '../../../theme/withThemeProvider';

jest.mock('../../charts/renderChart', () => ({
  __esModule: true,
  default: (chartType, props) => (
    <div>
      Chart:
      {chartType}
      <span>
        {/* eslint-disable-next-line no-undef */}
        {mockPropsCapture(props)}
      </span>
    </div>
  ),
}));

describe('Create element', () => {
  it('should provide element with data-grid', () => {
    const Chart = withThemeProvider(() =>
      renderWidget(
        {
          layout: { i: 'id-1' },
          chartType: 'Linechart',
          config: { chartName: 'title' },
        },
        jest.fn(),
        'dashboardId',
      ),
    );

    const { container } = render(<Chart />);

    expect(container).toMatchSnapshot();
  });
});
