import { render, waitFor } from '@testing-library/react';
import React from 'react';
import ConfigSelector from '../ConfigSelector';
import { selectDropDownOption } from '../../../../testUtil';

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

describe('<ConfigSelector />', () => {
  it('should match snapshot for configs for line chart', async () => {
    const updateConfigStateMock = jest.fn();
    const { container } = render(
      <ConfigSelector
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    await waitFor(() => document.getElementsByTagName('select x axis'));
    expect(container).toMatchSnapshot();
  });
  it('should update config on change of dropdown', async () => {
    const updateConfigStateMock = jest.fn();
    const renderedComponent = render(
      <ConfigSelector
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={updateConfigStateMock}
        values={{}}
      />,
    );
    await waitFor(() => document.getElementsByTagName('select x axis'));
    selectDropDownOption(renderedComponent, 'dropdown-x', 'column1');
    expect(updateConfigStateMock).toHaveBeenCalledWith('xAxis', 'column1');
  });
});
