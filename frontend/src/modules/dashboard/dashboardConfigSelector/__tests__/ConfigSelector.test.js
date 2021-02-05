import { render } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import ConfigSelector from '../ConfigSelector';
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

jest.mock('../../../../config/chartConfigOptions', () => ({
  xAxis: {
    component: () => <div>select x axis</div>,
  },
  yAxis: {
    component: () => <div>select y axis</div>,
  },
}));

describe('<ConfigSelector />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const ConfigSelectorWithTheme = withThemeProvider(ConfigSelector);
  it('should match snapshot for configs for line chart', async () => {
    const { container, findByText } = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(container).toMatchSnapshot();
  });

  it('should call getCsvHeaders with data source id on render', async () => {
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );
    await renderedComponent.findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('datasourceID');
  });

  it('should call getCsvHeaders with data source id on rerender for data source id change', async () => {
    const { findByText, rerender } = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('select x axis');

    rerender(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID2"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenLastCalledWith('datasourceID2');
  });

  it('should call resetValue for config of line chart', async () => {
    const resetValue = jest.fn();
    const { findByText, rerender } = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={resetValue}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('select x axis');

    rerender(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID2"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(resetValue).toHaveBeenCalledWith(['xAxis', 'yAxis']);
  });

  it('should show loader while fetching data', async () => {
    const renderedComponent = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
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
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');

    expect(getByText('Unable to fetch data source headers')).toBeInTheDocument();
  });

  it('should refetch data on click on retry button present on error banner', async () => {
    api.getCsvHeaders.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <ConfigSelectorWithTheme
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalled();
  });
});
