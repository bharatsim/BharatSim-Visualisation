import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChartSelectorStep from '../ChartSelectorStep';
import withThemeProvider from '../../../../theme/withThemeProvider';

const ComponentWithProvider = withThemeProvider(({ onNext, chart }) => (
  <ChartSelectorStep onNext={onNext} chart={chart} />
));

describe('Chart configuration wizard', () => {
  it('should match snapshot', () => {
    const { container } = render(<ComponentWithProvider onNext={jest.fn()} />);

    expect(container).toMatchSnapshot();
  });
  it('should select chart and pass selected chart to on next callback', () => {
    const onNext = jest.fn();
    const { getByTestId } = render(<ComponentWithProvider onNext={onNext} />);

    const lineChartOption = getByTestId('lineChart');

    fireEvent.click(lineChartOption);

    expect(onNext).toHaveBeenCalledWith('lineChart');
  });
});
