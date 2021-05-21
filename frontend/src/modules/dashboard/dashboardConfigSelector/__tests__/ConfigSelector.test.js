import { render } from '@testing-library/react';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import ConfigSelector from '../ConfigSelector';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { api } from '../../../../utils/api';
import { FormProvider } from '../../../../contexts/FormContext';

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
function MockComponent({ name }) {
  return <Field component="input" data-testid={name} name={name} />;
}
jest.mock('../../../../config/chartConfigOptions', () => ({
  xAxis: {
    component: () => <div>select x axis</div>,
  },
  yAxis: {
    component: () => <div>select y axis</div>,
  },
  annotation: {
    component: () => <div>annotation</div>,
  },
  config1: {
    component: () => <MockComponent name="config1" />,
  },
  config2: {
    component: () => <MockComponent name="config2" />,
  },
}));

jest.mock('../../../../config/chartConfigs', () => ({
  lineChart: {
    key: 'lineChart',
    label: 'Line Chart',
    icon: <>icon</>,
    chart: () => <div>Line chart</div>,
    configOptions: ['xAxis', 'yAxis'],
  },
  testChart: {
    key: 'testChart',
    label: 'Test Chart',
    icon: <>icon</>,
    chart: () => <div>Test chart</div>,
    configOptions: ['config1', 'config2'],
  },
}));

const ConfigSelectorWithProvider = withThemeProvider(ConfigSelector);

const TestForConfigSelector = ({
  onSubmit,
  isEditMode,
  chartType,
  dataSourceId,
  initialValues,
}) => (
  <Form
    onSubmit={onSubmit}
    mutators={{ ...arrayMutators }}
    initialValues={{ dataSource: dataSourceId, ...initialValues }}
    render={({ handleSubmit }) => (
      <FormProvider
        value={{
          chartType,
          isEditMode: !!isEditMode,
          registerDatasource: jest.fn(),
          unRegisterDatasource: jest.fn(),
        }}
      >
        <form onSubmit={handleSubmit}>
          <Field component="input" name="chartName" />
          <Field component="input" name="dataSource" />
          <ConfigSelectorWithProvider />
          <button type="submit">submit</button>
        </form>
      </FormProvider>
    )}
  />
);

describe('<ConfigSelector />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot for configs for line chart', async () => {
    const { container, findByText } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        isEditMode={false}
        onSubmit={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(container).toMatchSnapshot();
  });

  it('should call getCsvHeaders with data source id on render', async () => {
    const renderedComponent = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    await renderedComponent.findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('datasourceID');
  });

  it('should call getCsvHeaders with data source id on rerender for data source id change', async () => {
    const { findByText, rerender } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        isEditMode={false}
        onSubmit={jest.fn()}
      />,
    );

    await findByText('select x axis');

    rerender(
      <TestForConfigSelector
        dataSourceId="datasourceID2"
        chartType="lineChart"
        isEditMode={false}
        onSubmit={jest.fn()}
      />,
    );

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenLastCalledWith('datasourceID2');
    expect(api.getCsvHeaders).toHaveBeenCalledTimes(2);
  });

  it('should show loader while fetching data', async () => {
    const renderedComponent = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select x axis');
  });

  it('should show error if error occur while fetching data', async () => {
    api.getCsvHeaders.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');

    expect(getByText('Unable to fetch data source headers')).toBeInTheDocument();
  });

  it('should again fetch data on click on retry button present on error banner', async () => {
    api.getCsvHeaders.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="lineChart"
        resetValue={jest.fn()}
        errors={{}}
        isEditMode={false}
        control={{}}
        register={jest.fn()}
        watch={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    await findByText('Unable to fetch data source headers');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select x axis');

    expect(api.getCsvHeaders).toHaveBeenCalled();
  });

  it(`
   should reset all config except datasource and chart name on change of datasource id 
   and headers for datasource are different   
  `, async () => {
    api.getCsvHeaders
      .mockResolvedValueOnce({
        headers: [
          { name: 'column1', type: 'number' },
          { name: 'column2', type: 'number' },
        ],
      })
      .mockResolvedValueOnce({
        headers: [
          { name: 'column3', type: 'number' },
          { name: 'column4', type: 'number' },
        ],
      });
    const onSubmit = jest.fn();
    const { rerender, findByTestId, getByText } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="testChart"
        isEditMode={false}
        onSubmit={onSubmit}
        initialValues={{
          chartName: 'chartName',
          config1: 'config1',
          config2: 'config2',
        }}
      />,
    );

    await findByTestId('config1');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        chartName: 'chartName',
        config1: 'config1',
        config2: 'config2',
        dataSource: 'datasourceID',
      },
      expect.anything(),
      expect.anything(),
    );

    rerender(
      <TestForConfigSelector
        dataSourceId="datasourceID2"
        chartType="testChart"
        isEditMode={false}
        onSubmit={onSubmit}
        initialValues={{
          chartName: 'chartName',
          config1: 'config1',
          config2: 'config2',
        }}
      />,
    );

    await findByTestId('config1');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenLastCalledWith(
      {
        chartName: 'chartName',
        dataSource: 'datasourceID2',
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it(`should not reset config on change of datasource id  if headers for datasource are same`, async () => {
    const onSubmit = jest.fn();
    const { rerender, findByTestId, getByText } = render(
      <TestForConfigSelector
        dataSourceId="datasourceID"
        chartType="testChart"
        isEditMode={false}
        onSubmit={onSubmit}
        initialValues={{
          chartName: 'chartName',
          config1: 'config1',
          config2: 'config2',
        }}
      />,
    );

    await findByTestId('config1');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        chartName: 'chartName',
        config1: 'config1',
        config2: 'config2',
        dataSource: 'datasourceID',
      },
      expect.anything(),
      expect.anything(),
    );

    rerender(
      <TestForConfigSelector
        dataSourceId="datasourceID2"
        chartType="testChart"
        isEditMode={false}
        onSubmit={onSubmit}
        initialValues={{
          chartName: 'chartName',
          config1: 'config1',
          config2: 'config2',
        }}
      />,
    );

    await findByTestId('config1');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenLastCalledWith(
      {
        chartName: 'chartName',
        config1: 'config1',
        config2: 'config2',
        dataSource: 'datasourceID2',
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
