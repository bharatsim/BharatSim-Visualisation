import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChartSelectorStep from '../ChartSelectorStep';
import withThemeProvider from '../../../../theme/withThemeProvider';

const ComponentWithProvider = withThemeProvider(({ onNext, chart }) => (
  <ChartSelectorStep onNext={onNext} chart={chart} />
));

describe('Chart configuration wizard', () => {
  it('should match snapshot', () => {
    const { container } = render(<ComponentWithProvider onNext={jest.fn()} chart="" />);

    expect(container).toMatchSnapshot();
  });
  it('should select chart and pass selected chart to on next callback', () => {
    const onNext = jest.fn();
    const { getByText } = render(<ComponentWithProvider onNext={onNext} chart="" />);

    const lineChartOption = getByText('Line Chart');
    const nextButton = getByText('Next');

    fireEvent.click(lineChartOption);
    fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalledWith('lineChart');
  });

  it('should disable next button if not chart is selected', () => {
    const onNext = jest.fn();
    const { getByText } = render(<ComponentWithProvider onNext={onNext} chart="" />);

    const nextButton = getByText('Next').closest('button');

    expect(nextButton).toBeDisabled();
  });

  it('should call next with initial selected chart', () => {
    const onNext = jest.fn();
    const { getByText } = render(<ComponentWithProvider onNext={onNext} chart="Bar Chart" />);

    const nextButton = getByText('Next');

    fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalledWith('Bar Chart');
  });
});
