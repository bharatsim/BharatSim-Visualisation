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
        resetValue={jest.fn()}
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
        resetValue={jest.fn()}
      />,
    );
    await renderedComponent.findByText('select x axis');

    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');

    expect(updateConfigStateMock).toHaveBeenCalledWith('xAxis', 'column1');
  });

  it('should call getCsvHeaders with data source id on render', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
        resetValue={jest.fn()}
      />,
    );
    await renderedComponent.findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('dataSourceId');
  });

  it('should call getCsvHeaders with data source id on rerender for data source id change', async () => {
    const updateConfigStateMock = jest.fn();
    const { findByText, rerender } = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
        resetValue={jest.fn()}
      />,
    );

    await findByText('select x axis');

    rerender(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId2"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
        resetValue={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('dataSourceId2');
  });

  it('should call resetValue for config of line chart', async () => {
    const resetValue = jest.fn();
    const { findByText, rerender } = render(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={jest.fn()}
        values={{}}
        resetValue={resetValue}
      />,
    );

    await findByText('select x axis');

    rerender(
      <ConfigSelectorWithTheme
        chartType="lineChart"
        dataSourceId="dataSourceId2"
        errors={{}}
        updateConfigState={jest.fn()}
        values={{}}
        resetValue={resetValue}
      />,
    );

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('dataSourceId2');
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
        resetValue={jest.fn()}
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
        resetValue={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');

    expect(getByText('Unable to fetch data source headers')).toBeInTheDocument();
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
        resetValue={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalled();
  });
});
