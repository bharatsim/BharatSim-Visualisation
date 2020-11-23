import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChartConfigurationWizard from '../ChartConfigurationWizard';
import withThemeProvider from '../../../../theme/withThemeProvider';
import { selectDropDownOption } from '../../../../testUtil';

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

const ComponentWithProvider = withThemeProvider(({ closeModal, isOpen, onApply }) => (
  <ChartConfigurationWizard closeModal={closeModal} isOpen={isOpen} onApply={onApply} />
));

describe('Chart configuration wizard', () => {
  it('should match snapshot', () => {
    render(<ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />);

    const sideBarWizard = document.querySelector('.MuiDrawer-root');

    expect(sideBarWizard).toMatchSnapshot();
  });
  it('should select chart and go to next step of configure chart', async () => {
    const { findByText, getByText } = render(
      <ComponentWithProvider closeModal={jest.fn()} isOpen onApply={jest.fn()} />,
    );

    const lineChartOption = getByText('Line Chart');
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
    const { findByText, getByText } = renderedComponent;

    const lineChartOption = getByText('Line Chart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);
    await findByText('Data Source');

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource2');
    await findByText('select x axis');
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');
    selectDropDownOption(renderedComponent, 'dropdown-y', 'column2');

    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);

    expect(onApplyMock).toHaveBeenCalledWith('lineChart', {
      dataSource: 'id2',
      xAxis: 'column1',
      yAxis: [{ name: 'column2', type: 'number' }],
    });
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
