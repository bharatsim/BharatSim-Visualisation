import React from 'react';
import { render } from '@testing-library/react';
import ChartConfigSelectorStep from '../ChartConfigSelectorStep';

jest.mock('../../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1' },
        { name: 'datasource2', _id: 'id2' },
      ],
    }),
    getCsvHeaders: jest.fn().mockResolvedValue({
      headers: [
        { name: 'column1', type: 'number' },
        { name: 'column2', type: 'number' },
      ],
    }),
  },
}));
describe('chart config selector', () => {
  it('should match snapshot', async () => {
    const { container, findByText } = render(
      <ChartConfigSelectorStep chartType="lineChart" onApply={jest.fn()} />,
    );
    await findByText('Data Source');
    expect(container).toMatchSnapshot();
  });
});
