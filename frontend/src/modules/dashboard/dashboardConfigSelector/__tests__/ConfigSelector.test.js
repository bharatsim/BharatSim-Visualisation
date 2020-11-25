import { render } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import ConfigSelector from '../ConfigSelector';
import { selectDropDownOption } from '../../../../testUtil';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { api } from '../../../../utils/api';

jest.mock('../../../../utils/api', () => ({
  api: {
    getCsvHeaders: jest.fn().mockResolvedValue({
      headers: [
        { name: 'column1', type: 'number' },
        { name: 'column2', type: 'number' },
      ],
    }),
  },
}));

describe('<ConfigSelector />', () => {
  const ConfigSelectorWithTheme = withThemeProvider(ConfigSelector);
  it('should match snapshot for configs for line chart', async () => {
    const updateConfigStateMock = jest.fn();
    const { container, findByText } = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    await findByText('select x axis');

    expect(container).toMatchSnapshot();
  });
  it('should update config on change of dropdown', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    await renderedComponent.findByText('select x axis');

    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');

    expect(updateConfigStateMock).toHaveBeenCalledWith('xAxis', 'column1');
  });

  it('should show loader while fetching data', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select x axis');
  });

  it('should show loader while fetching data', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select x axis');
  });

  it('should show error if error occur while fetching data', async () => {
    api.getCsvHeaders.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={jest.fn()}
        values={{}}
      />,
    );

    await findByText('Unable to fetch axis');

    expect(getByText('Unable to fetch axis')).toBeInTheDocument();
  });

  it('should refetch data on click on retry button present on error banner', async () => {
    api.getCsvHeaders.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={jest.fn()}
        values={{}}
      />,
    );

    await findByText('Unable to fetch axis');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalled();
  });
});
