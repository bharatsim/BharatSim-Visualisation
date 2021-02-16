import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';
import { api } from '../../../utils/api';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import CholoroplethConfigs from '../CholoroplethConfigs';

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

const ComponentWithProvider = withProjectLayout(withRouter(withThemeProvider(CholoroplethConfigs)));

const TestForCholoroplethConfigs = ({ onSubmit }) => {
  const { control, errors, handleSubmit, watch } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'choroplethConfig',
    isEditMode: false,
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ComponentWithProvider
        {...props}
        control={control}
        error={errors[props.configKey]}
        watch={watch}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<ChoroplethMapLayerConfigs />', () => {
  it('should show single choropleth config by default', async () => {
    const renderComponent = render(<TestForCholoroplethConfigs onSubmit={jest.fn()} />);
    const { findByText, queryByText } = renderComponent;

    await findByText('select map layer');

    expect(queryByText('Drill down - Top Level')).toBeNull();
  });

  it('should show drilldown choropleth config on switch to drill down', async () => {
    const renderComponent = render(<TestForCholoroplethConfigs onSubmit={jest.fn()} />);
    const { findByText, getByText, getAllByRole } = renderComponent;

    await findByText('select map layer');

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    await findByText('select map layer');

    expect(getByText('Drill down - Top Level')).toBeInTheDocument();
  });

  it('should call on submit with selected data', async () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<TestForCholoroplethConfigs onSubmit={onSubmit} />);
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
