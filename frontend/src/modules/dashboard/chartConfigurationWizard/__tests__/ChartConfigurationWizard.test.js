import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChartConfigurationWizard from '../ChartConfigurationWizard';
import withThemeProvider from '../../../../theme/withThemeProvider';

const ComponentWithProvider = withThemeProvider(({ closeModal, isOpen }) => (
  <ChartConfigurationWizard closeModal={closeModal} isOpen={isOpen} />
));

describe('Chart configuration wizard', () => {
  it('should match snapshot', () => {
    render(<ComponentWithProvider closeModal={jest.fn()} isOpen />);

    const sideBarWizard = document.querySelector('.MuiDrawer-root');

    expect(sideBarWizard).toMatchSnapshot();
  });
  it('should select chart and go to next step of configure chart', () => {
    const { getByText } = render(<ComponentWithProvider closeModal={jest.fn()} isOpen />);

    const lineChartOption = getByText('Line Chart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);

    expect(getByText('Chart Name')).toBeInTheDocument();
  });

  it('should close modal on click of close icon', () => {
    const closeModal = jest.fn();
    const { getByTestId } = render(<ComponentWithProvider closeModal={closeModal} isOpen />);

    const closeIcon = getByTestId('close-wizard');

    fireEvent.click(closeIcon);

    expect(closeModal).toHaveBeenCalled();
  });
});
