import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  it('should match snapshot', () => {
    render(<ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />);

    const sideBarWizard = document.querySelector('.MuiDrawer-root');

    expect(sideBarWizard).toMatchSnapshot();
  });
  it('should select chart and go to next step of configure chart', async () => {
    const { findByText, getByText, getByTestId } = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />,
    );

    const lineChartOption = getByTestId('lineChart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);
    await findByText('Data Source');

    expect(getByText('Data Source')).toBeInTheDocument();
  });

  it('should call on apply function on click of on apply button of config step', async () => {
    const onApplyMock = jest.fn();
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={onApplyMock} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);
    await findByText('Data Source');

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');
    selectDropDownOption(renderedComponent, 'dropdown-y-0', 'column2');

    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);

    expect(onApplyMock).toHaveBeenCalledWith('lineChart', {
      dataSource: 'id2',
      xAxis: 'column1',
      yAxis: [{ name: 'column2', type: 'number' }],
    });
  });
  it('should disable apply button if any config is not selected', async () => {
    const onApplyMock = jest.fn();
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={onApplyMock} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);
    await findByText('Data Source');

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');

    const applyButton = getByText('Apply').closest('button');

    expect(applyButton).toBeDisabled();
  });

  it('should get back to chart selector step on click of back to chart type', async () => {
    const renderedComponent = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />,
    );
    const { findByText, getByText, getByTestId } = renderedComponent;

    const lineChartOption = getByTestId('lineChart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);
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
