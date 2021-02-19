import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import ChartConfigurationWizard from '../ChartConfigurationWizard';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../../testUtil';

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

const ComponentWithProvider = withThemeProvider(
  withRouter(withProjectLayout(ChartConfigurationWizard)),
);

describe('Chart configuration wizard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should match snapshot in edit mode', async () => {
    const existingChart = {
      chartType: 'lineChart',
      config: {
        chartName: 'line chart with config',
        dataSource: 'id1',
        xAxis: 'column1',
        yAxis: [{ name: 'column2' }],
      },
      layout: { i: 'widget-3', x: 6, y: null, w: 6, h: 2 },
    };
    const { findByText, getByLabelText, getByTestId } = render(
      <ComponentWithProvider
        chart={existingChart}
        closeModal={jest.fn()}
        isOpen
        onApply={jest.fn()}
      />,
    );

    await findByText('Data Source');
    expect(getByLabelText('Add chart name')).toHaveValue('line chart with config');

    await findByText('select x axis');
    const xAxisDropdown = within(getByTestId('x-axis-dropdown'));
    const yAxisDropdown = within(getByTestId('y-axis-dropdown-0'));

    expect(xAxisDropdown.getByRole('button')).toHaveTextContent('column1');
    expect(yAxisDropdown.getByRole('button')).toHaveTextContent('column2');
  });

  it('should select chart and go to next step of configure chart', async () => {
    const { findByText, getByText, getByTestId } = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />,
    );

    const lineChartOption = getByTestId('lineChart');
    fireEvent.click(lineChartOption);

    await findByText('Data Source');

    expect(getByText('Data Source')).toBeInTheDocument();
  });

  it('should call on apply function on click of on apply button of config step', async () => {
    const mockOnApply = jest.fn();
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={mockOnApply} />,
    );
    const { findByText, getByText, getByTestId, getByLabelText } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');

    fireEvent.click(lineChartOption);
    await findByText('Data Source');

    const chartNameInput = getByLabelText('Add chart name');
    fireEvent.input(chartNameInput, {
      target: { value: 'chart name' },
    });

    await selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    await selectDropDownOption(renderedComponent, 'x-axis-dropdown', 'column1');
    await selectDropDownOption(renderedComponent, 'y-axis-dropdown-0', 'column2');

    const applyButton = getByText('Apply');

    await act(async () => {
      expect(applyButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(mockOnApply).toHaveBeenCalledWith(undefined, 'lineChart', {
      chartName: 'chart name',
      dataSource: 'id2',
      xAxis: 'column1',
      yAxis: [{ name: 'column2' }],
    });
  });

  it('should call on apply function on click of on apply button of config step with default chart name', async () => {
    const onApplyMock = jest.fn();
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={onApplyMock} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');

    fireEvent.click(lineChartOption);
    await findByText('Data Source');

    await selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    await selectDropDownOption(renderedComponent, 'x-axis-dropdown', 'column1');
    await selectDropDownOption(renderedComponent, 'y-axis-dropdown-0', 'column2');

    const applyButton = getByText('Apply');

    await act(async () => {
      expect(applyButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(onApplyMock).toHaveBeenCalledWith(undefined, 'lineChart', {
      chartName: 'Untitled Chart',
      dataSource: 'id2',
      xAxis: 'column1',
      yAxis: [{ name: 'column2' }],
    });
  });
  it('should disable apply button if any config is not selected', async () => {
    const onApplyMock = jest.fn();
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={onApplyMock} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');

    fireEvent.click(lineChartOption);
    await findByText('Data Source');

    await selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    await selectDropDownOption(renderedComponent, 'x-axis-dropdown', 'column1');

    const applyButton = getByText('Apply').closest('button');

    await act(async () => {
      expect(applyButton).toBeDisabled();
    });
  });

  it('should get back to chart selector step on click of back to chart type', async () => {
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');

    fireEvent.click(lineChartOption);
    await findByText('Data Source');

    const backToChartTypeButton = getByText('Back to chart type').closest('button');
    fireEvent.click(backToChartTypeButton);

    expect(getByText('Choose a chart type to start configuring your chart')).toBeInTheDocument();
  });

  it('should close modal on click of close icon', () => {
    const closeModal = jest.fn();
    const { getByTestId } = render(
      <ComponentWithProvider closeModal={closeModal} isOpen onApply={jest.fn()} />,
    );

    const closeIcon = getByTestId('close-wizard');

    fireEvent.click(closeIcon);

    expect(closeModal).toHaveBeenCalled();
  });
});
