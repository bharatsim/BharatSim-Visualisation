import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import ChoroplethMapLayerConfig from '../ChoroplethMapLayerConfigs';
import { api } from '../../../utils/api';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';

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
  withRouter(withThemeProvider(ChoroplethMapLayerConfig)),
);

const TestForChoroplethMapLayerConfig = ({ onSubmit, shouldShowReferenceIdConfig, isEditMode,levelIndex }) => {
  const form = useForm({ mode: 'onChange' });
  const { control, errors, handleSubmit, watch } = form;
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'mapLayerConfig',
    isEditMode,
    shouldShowReferenceIdConfig: shouldShowReferenceIdConfig || false,
    levelIndex: levelIndex || 0,
  };
  const methods = { ...form, defaultValues: {}, isEditMode };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentWithProvider
          {...props}
          control={control}
          error={errors[props.configKey]}
          watch={watch}
        />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<ChoroplethMapLayerConfigs />', () => {
  it('should fetch data on change of map layer selection and data for map layer', async () => {
    const renderComponent = render(<TestForChoroplethMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText } = renderComponent;

    await findByText('select map layer');

    await selectDropDownOption(renderComponent, 'gisMapLayer-dropdown', 'datasource1');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('d_id1');
    expect(api.getDatasources).toHaveBeenCalledWith('id1');
  });
  it('should be able to edit map layer datasource in edit configuration', async () => {
    const renderComponent = render(
      <TestForChoroplethMapLayerConfig onSubmit={jest.fn()} isEditMode />,
    );
    const { findByText } = renderComponent;

    await findByText('select map layer');

    await selectDropDownOption(renderComponent, 'gisMapLayer-dropdown', 'datasource1');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('d_id1');
    expect(api.getDatasources).toHaveBeenCalledWith('id1');
  });

  it('should show reference id selected dropdown if shouldShowReferenceIdConfig is true', async () => {
    const renderComponent = render(
      <TestForChoroplethMapLayerConfig onSubmit={jest.fn()} shouldShowReferenceIdConfig />,
    );
    const { findByText, getByText } = renderComponent;

    await findByText('select map layer');

    expect(getByText('select reference id')).toBeInTheDocument();
  });

  it('should show reference id selected dropdown with title Reference ID for Level 2', async () => {
    const renderComponent = render(
      <TestForChoroplethMapLayerConfig
        onSubmit={jest.fn()}
        shouldShowReferenceIdConfig
        levelIndex={2}
      />,
    );
    const { findByText, getByText } = renderComponent;

    await findByText('select map layer');

    expect(getByText('Reference ID for Level 2')).toBeInTheDocument();
  });

  it('should disable map layer id and data layer id if map layer is not selected', async () => {
    const renderComponent = render(<TestForChoroplethMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByTestId } = renderComponent;

    await findByText('select map layer');

    expect(getByTestId('mapLayerId')).toHaveClass('Mui-disabled');
  });

  it('should call on submit with selected data', async () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<TestForChoroplethMapLayerConfig onSubmit={onSubmit} />);
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
        mapLayerConfig: { mapLayer: 'd_id1', mapLayerId: 'column1', dataLayerId: 'a' },
      },
      expect.anything(),
    );
  });

  it('should show error while fetching headers', async () => {
    api.getCsvHeaders.mockRejectedValue('error');
    const renderComponent = render(<TestForChoroplethMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByText } = renderComponent;

    await findByText('select map layer');

    await selectDropDownOption(renderComponent, 'gisMapLayer-dropdown', 'datasource1');

    expect(
      getByText('Unable to fetch data source headers might be due to wrong file type'),
    ).toBeInTheDocument();
  });
});
