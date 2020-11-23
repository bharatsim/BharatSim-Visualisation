import { render, waitFor } from '@testing-library/react';
import React from 'react';
import DatasourceSelector from '../DatasourceSelector';
import { selectDropDownOption } from '../../../../testUtil';

jest.mock('../../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1' },
        { name: 'datasource2', _id: 'id2' },
      ],
    }),
  },
}));

describe('<DatasourceSelector />', () => {
  it('should match snapshot for datasource selector', async () => {
    const { container, getByText } = render(
      <DatasourceSelector handleDataSourceChange={jest.fn()} value="" error="" />,
    );

    await waitFor(() => getByText('Data Source'));
    expect(container).toMatchSnapshot();
  });
  it('should handle datsource change on click of different datsource name', async () => {
    const handleDataSourceChangeMock = jest.fn();
    const renderedComponent = render(
      <DatasourceSelector handleDataSourceChange={handleDataSourceChangeMock} value="" error="" />,
    );

    await waitFor(() => renderedComponent.getByText('Data Source'));

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    expect(handleDataSourceChangeMock).toHaveBeenCalledWith('id2');
  });
});
