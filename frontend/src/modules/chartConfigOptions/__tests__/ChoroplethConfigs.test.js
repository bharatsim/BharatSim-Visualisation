import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';
import { api } from '../../../utils/api';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChoroplethConfigs from '../ChoroplethConfigs';

jest.mock('../../../utils/api', () => ({
  api: {
    getCsvHeaders: jest.fn().mockResolvedValue({
      headers: [
        { name: 'column1', type: 'number' },
        { name: 'column2', type: 'number' },
      ],
    }),
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'd_id1' },
        { name: 'datasource2', _id: 'd_id2' },
      ],
    }),
  },
}));

const ComponentWithProvider = withProjectLayout(withRouter(withThemeProvider(ChoroplethConfigs)));

const TestForChoroplethConfigs = ({ onSubmit, isEditMode, leveIndex }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'choroplethConfig',
    isEditMode,
    leveIndex,
  };
  const mockRegisterDatasource = jest.fn();
  const method = {
    ...form,
    isEditMode,
    defaultValues: {},
    registerDatasource: mockRegisterDatasource,
  };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentWithProvider {...props} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<ChoroplethConfigs />', () => {
  it('should show single choropleth config by default', async () => {
    const renderComponent = render(<TestForChoroplethConfigs onSubmit={jest.fn()} />);
    const { findByText, queryByText } = renderComponent;

    await findByText('select map layer');

    expect(queryByText('Drill down - Level 1 (Top Level)')).toBeNull();
  });

  it('should show drill down choropleth config on switch to drill down', async () => {
    const renderComponent = render(<TestForChoroplethConfigs onSubmit={jest.fn()} />);
    const { findByText, getByText, getAllByRole } = renderComponent;

    await findByText('select map layer');

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    await findByText('select map layer');

    expect(getByText('Drill Down - Level 1 (Top Level)')).toBeInTheDocument();
  });

  it('should disable radio buttons in edit config mode', async () => {
    const renderComponent = render(<TestForChoroplethConfigs onSubmit={jest.fn()} isEditMode />);
    const { findByText, getByText } = renderComponent;

    await findByText('select map layer');
    const MultiLevelDrillDownOption = getByText('Multi level Drill down');
    const SingleChoropleth = getByText('Single level');

    expect(MultiLevelDrillDownOption).toHaveClass('Mui-disabled');
    expect(SingleChoropleth).toHaveClass('Mui-disabled');
  });

  it('should call on submit with selected data', async () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<TestForChoroplethConfigs onSubmit={onSubmit} />);
    const { findByText, getByTestId, findByTestId, getByText } = renderComponent;

    await findByText('select map layer');

    await selectDropDownOption(renderComponent, 'gisMapLayer-dropdown', 'datasource1');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('d_id1');

    await findByTestId('mapLayerId');

    expect(getByTestId('mapLayerId')).not.toHaveClass('Mui-disabled');

    await selectDropDownOption(renderComponent, 'mapLayerId', 'column1');

    await selectDropDownOption(renderComponent, 'dataLayerId', 'a');

    await act(async () => {
      fireEvent.click(getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        choroplethConfig: {
          choroplethType: 'singleLevel',
          mapLayerConfig: [{ dataLayerId: 'a', mapLayer: 'd_id1', mapLayerId: 'column1' }],
        },
      },
      expect.anything(),
    );
  });
});
