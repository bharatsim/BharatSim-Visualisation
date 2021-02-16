import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';
import { api } from '../../../utils/api';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChoroplethMultiMapLayerConfig from '../ChoroplethMultiMapLayerConfig';

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

const ComponentWithProvider = withProjectLayout(
  withRouter(withThemeProvider(ChoroplethMultiMapLayerConfig)),
);

const TestForChoroplethMultiMapLayerConfig = ({ onSubmit, isEditMode }) => {
  const { control, errors, handleSubmit, watch } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'mapLayerConfig',
    isEditMode: isEditMode || false,
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
  it('should show header for multiple config i.e for first on  Top Level, for  second Level 2', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { getByText, findByText } = renderComponent;

    await findByText('select map layer');

    expect(getByText('Drill down - Top Level')).toBeInTheDocument();
  });

  it('should not add level if edit mode is on', async () => {
    const renderComponent = render(
      <TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} isEditMode />,
    );
    const { queryByText } = renderComponent;

    expect(queryByText('Drill down - Top Level')).toBeNull();
  });

  it('should add another level on click of add level button', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByText } = renderComponent;

    await findByText('select map layer');

    fireEvent.click(getByText('Add Level'));

    await findByText('select map layer');

    expect(getByText('Drill down - Level 2')).toBeInTheDocument();
  });

  it('should delete level2 on click of delete level button', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByText, getByTestId } = renderComponent;

    await findByText('select map layer');

    fireEvent.click(getByText('Add Level'));

    await findByText('select map layer');

    const level2 = getByText('Drill down - Level 2');

    expect(level2).toBeInTheDocument();

    fireEvent.click(getByTestId('delete-level-1'));

    expect(level2).not.toBeInTheDocument();
  });

  it('should call on submit with selected data', async () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={onSubmit} />);
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
        mapLayerConfig: [{ mapLayer: 'd_id1', mapLayerId: 'column1', dataLayerId: 'a' }],
      },
      expect.anything(),
    );
  });
});
