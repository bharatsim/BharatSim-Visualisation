import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import ChartConfigurationHeader from '../ChartConfigurationHeader';

describe('Chart configuration header', () => {
  it('should match snapshot without chart name', () => {
    const { container } = render(<ChartConfigurationHeader closeModal={jest.fn()} chart="" />);

    expect(container).toMatchSnapshot();
  });

  it('should call close wizard on click of close icon', () => {
    const closeModal = jest.fn();
    const { getByTestId } = render(
      <ChartConfigurationHeader closeModal={closeModal} chart="line chart" />,
    );

    const closeIcon = getByTestId('close-wizard');

    fireEvent.click(closeIcon);

    expect(closeModal).toHaveBeenCalled();
  });

  it('should show chart name if it is present', () => {
    const closeModal = jest.fn();
    const { getByText } = render(
      <ChartConfigurationHeader closeModal={closeModal} chart="line chart" />,
    );

    expect(getByText('line chart')).toBeInTheDocument();
  });
});
