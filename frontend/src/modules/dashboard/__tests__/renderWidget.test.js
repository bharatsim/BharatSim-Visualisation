import React from 'react';
import { render } from '@testing-library/react';
import { renderWidget } from '../renderWidget';
import withThemeProvider from '../../../theme/withThemeProvider';

function MockBomb() {
  throw new Error();
  // eslint-disable-next-line no-unreachable
  return <div>Bomb</div>;
}

jest.mock('../../charts/renderChart', () => ({
  __esModule: true,
  default: (chartType, props) => (
    <div>
      {chartType === 'error' && <MockBomb />}
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
    const Chart = withThemeProvider(() => (
      <div>
        {renderWidget({
          chart: {
            layout: { i: 'id-1' },
            chartType: 'Linechart',
            config: { chartName: 'title' },
          },
          dashboardId: 'dashboardId',
          onDelete: jest.fn(),
          onEdit: jest.fn(),
          dashboardLayout: [{ i: 'id-1-Linechart-dashboardId' }],
        })}
      </div>
    ));

    const { container } = render(<Chart />);

    expect(container).toMatchSnapshot();
  });

  it('should show error if error occure in chart rendering', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const Chart = withThemeProvider(() => (
      <div>
        {renderWidget({
          chart: {
            layout: { i: 'id-1' },
            chartType: 'error',
            config: { chartName: 'title' },
          },
          dashboardId: 'dashboardId',
          onDelete: jest.fn(),
          onEdit: jest.fn(),
          dashboardLayout: [{ i: 'id-1-Linechart-dashboardId' }],
        })}
      </div>
    ));

    const { getByText } = render(<Chart />);

    expect(
      getByText('unable to plot chart, there might be some error or type mismatch with config'),
    ).toBeInTheDocument();
    jest.clearAllMocks();
  });
});
