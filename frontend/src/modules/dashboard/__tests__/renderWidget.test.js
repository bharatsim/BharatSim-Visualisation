import React from 'react';
import { render } from '@testing-library/react';
import { renderWidget } from '../renderWidget';

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
    const element = renderWidget({
      layout: { i: 'id-1' },
      chartType: 'Linechart',
      config: { chartName: 'title' },
    });
    const { container } = render(<>{element}</>);

    expect(container).toMatchSnapshot();
  });
});
