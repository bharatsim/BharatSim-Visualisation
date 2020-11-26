import { render, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import React from 'react';
import DatasourceSelector from '../DatasourceSelector';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../../testUtil';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';

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
  const DatasourceSelectorWithProvider = withThemeProvider(
    withRouter(withProjectLayout(DatasourceSelector)),
  );
  it('should match snapshot for datasource selector', async () => {
    const { container, getByText } = render(
      <DatasourceSelectorWithProvider handleDataSourceChange={jest.fn()} value="" error="" />,
    );

    await waitFor(() => getByText('Data Source'));
    expect(container).toMatchSnapshot();
  });

  it('should handle datsource change on click of different datsource name', async () => {
    const handleDataSourceChangeMock = jest.fn();
    const renderedComponent = render(
      <DatasourceSelectorWithProvider
        handleDataSourceChange={handleDataSourceChangeMock}
        value=""
        error=""
      />,
    );

    await waitFor(() => renderedComponent.getByText('Data Source'));

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    expect(handleDataSourceChangeMock).toHaveBeenCalledWith('id2');
  });

  it('should show loader while fetching data', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <DatasourceSelectorWithProvider
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        handleDataSourceChange={updateConfigStateMock}
        values={{}}
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select data source');
  });

  it('should show error if error occur while fetching data', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <DatasourceSelectorWithProvider
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        handleDataSourceChange={jest.fn()}
        values={{}}
      />,
    );

    await findByText('Unable to fetch data sources');

    expect(getByText('Unable to fetch data sources')).toBeInTheDocument();
  });

  it('should refetch data on click on retry button present on error banner', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <DatasourceSelectorWithProvider
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        handleDataSourceChange={jest.fn()}
        values={{}}
      />,
    );

    await findByText('Unable to fetch data sources');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select data source');

    expect(api.getDatasources).toHaveBeenCalled();
  });
});
