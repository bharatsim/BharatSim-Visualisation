import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import ChartConfigurationHeader from '../ChartConfigurationHeader';
import withThemeProvider from '../../../../theme/withThemeProvider';

describe('Chart configuration header', () => {
  const ChartConfigurationHeaderWithTheme = withThemeProvider(ChartConfigurationHeader);
  it('should match snapshot without chart name', () => {
    const { container } = render(
      <ChartConfigurationHeaderWithTheme closeModal={jest.fn()} chart="" activeStep={0} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call close wizard on click of close icon', () => {
    const closeModal = jest.fn();
    const { getByTestId } = render(
      <ChartConfigurationHeaderWithTheme
        closeModal={closeModal}
        chart="lineChart"
        activeStep={0}
      />,
    );

    const closeIcon = getByTestId('close-wizard');

    fireEvent.click(closeIcon);

    expect(closeModal).toHaveBeenCalled();
  });

  it('should show chart name and icon if chart is selected and active step is not in step one', () => {
    const closeModal = jest.fn();
    const { getByText, getByAltText } = render(
      <ChartConfigurationHeaderWithTheme
        closeModal={closeModal}
        chart="lineChart"
        activeStep={1}
      />,
    );

    expect(getByText('Line Chart')).toBeInTheDocument();
    expect(getByAltText('lineChart')).toBeInTheDocument();
  });

  it('should not show chart name and icon if chart is not selected', () => {
    const closeModal = jest.fn();
    const { queryByText } = render(
      <ChartConfigurationHeaderWithTheme closeModal={closeModal} chart="" activeStep={1} />,
    );

    expect(queryByText('line chart')).toBeNull();
  });

  it('should not show chart name and icon if active step is zero', () => {
    const closeModal = jest.fn();
    const { queryByText } = render(
      <ChartConfigurationHeaderWithTheme
        closeModal={closeModal}
        chart="lineChart"
        activeStep={0}
      />,
    );

    expect(queryByText('line chart')).toBeNull();
  });
});
