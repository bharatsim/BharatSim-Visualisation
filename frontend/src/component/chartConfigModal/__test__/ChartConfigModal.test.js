import React from 'react';

import { fireEvent, render, waitFor, within } from '@testing-library/react';

import ChartConfigModal from '../ChartConfigModal';
import { chartTypes } from '../../../constants/charts';
import { selectDropDownOption } from '../../../testUtil';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { _id: 'id1', name: 'modelone' },
        { _id: 'id2', name: 'modeltwo' },
      ],
    }),
    getCsvHeaders: jest.fn().mockResolvedValue({
      headers: [
        { name: 'x-header', type: 'string' },
        { name: 'y-header', type: 'number' },
      ],
    }),
  },
}));

describe('<ChartConfigModal />', () => {
  const props = {
    onCancel: jest.fn(),
    onOk: jest.fn(),
    open: true,
    chartType: chartTypes.LINE_CHART,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match a snapshot for <ChartConfigModal />', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    expect(document.querySelector('.MuiPaper-root')).toMatchSnapshot();
  });

  it('should disable ok button if no option is selected for dropdown', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    selectDropDownOption(configModal, 'dropdown-dataSources', 'modelone');

    const okButton = configModal.getByTestId('button-Ok');

    await waitFor(() => {
      expect(okButton).toBeDisabled();
    });
  });

  it('should be show x-axis and y-axis dropdown if data source selected', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    selectDropDownOption(configModal, 'dropdown-dataSources', 'modelone');

    await waitFor(() => configModal.queryByText('dropdown-x'));

    const xDropdown = within(configModal.getByTestId('dropdown-x'));
    const yDropdown = within(configModal.getByTestId('dropdown-y'));

    await waitFor(() => {
      expect(xDropdown.getByRole('button')).toBeInTheDocument();
      expect(yDropdown.getByRole('button')).toBeInTheDocument();
    });
  });

  it('should be hide x-axis and y-axis dropdown if data source is not selected', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    const xDropdown = configModal.queryByTestId('dropdown-x');
    const yDropdown = configModal.queryByTestId('dropdown-y');

    expect(xDropdown).toBeNull();
    expect(yDropdown).toBeNull();
  });

  it('should pass selected chart configs to onOK callback', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    selectDropDownOption(configModal, 'dropdown-dataSources', 'modelone');

    await waitFor(() => expect(api.getCsvHeaders).toBeCalledTimes(1));

    selectDropDownOption(configModal, 'dropdown-x', 'x-header');

    selectDropDownOption(configModal, 'dropdown-y', 'y-header');

    const okButton = configModal.getByText(/Ok/i);

    fireEvent.click(okButton);

    expect(props.onOk).toHaveBeenCalledWith({
      dataSource: 'id1',
      xAxis: 'x-header',
      yAxis: [
        {
          name: 'y-header',
          type: 'number',
        },
      ],
    });
  });

  it('should show validation error if column selected is of x-type', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    selectDropDownOption(configModal, 'dropdown-dataSources', 'modelone');

    await waitFor(() => expect(api.getCsvHeaders).toBeCalledTimes(1));

    selectDropDownOption(configModal, 'dropdown-x', 'x-header');

    selectDropDownOption(configModal, 'dropdown-y', 'x-header');

    expect(configModal.queryByText(/Please select number type option/)).not.toBeNull();
  });

  it('should close select config modal on cancel click', async () => {
    render(<ChartConfigModal {...props} />);

    await waitFor(() => document.querySelector('.MuiPaper-root'));

    const configModal = within(document.querySelector('.MuiPaper-root'));

    const cancelButton = configModal.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(props.onCancel).toHaveBeenCalled();
  });
});
