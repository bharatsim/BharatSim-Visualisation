import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { fireEvent } from '@testing-library/dom';
import { api } from '../../../utils/api';

import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import ChoroplethMultiMapLayerConfig from '../ChoroplethMultiMapLayerConfig';
import { FormProvider } from '../../../contexts/FormContext';

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
        { name: 'datasource1', _id: 'd_id1', fileType: 'geojson' },
        { name: 'datasource2', _id: 'd_id2', fileType: 'geojson' },
      ],
    }),
  },
}));

const ComponentWithProvider = withProjectLayout(
  withRouter(withThemeProvider(ChoroplethMultiMapLayerConfig)),
);
const mockRegisterDatasource = jest.fn();
const mockUnRegisterDatasource = jest.fn();
const TestForChoroplethMultiMapLayerConfig = ({ onSubmit, isEditMode }) => {
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'mapLayerConfig',
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={{ mapLayerConfig: [{}] }}
      render={({ handleSubmit }) => (
        <FormProvider
          value={{
            isEditMode: !!isEditMode,
            registerDatasource: mockRegisterDatasource,
            unRegisterDatasource: mockUnRegisterDatasource,
          }}
        >
          <form onSubmit={handleSubmit}>
            <ComponentWithProvider {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<ChoroplethMultiMapLayerConfigs />', () => {
  it('should show header for multiple config i.e for first on  Top Level, for  second Level 2', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { getByText, findByText } = renderComponent;

    await findByText('Select map layer');

    expect(getByText('Drill Down - Level 1 (Top Level)')).toBeInTheDocument();
  });

  it('should add another level on click of add level button', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByText } = renderComponent;

    await findByText('Select map layer');

    fireEvent.click(getByText('Add level'));

    await findByText('Select map layer');

    expect(getByText('Drill Down - Level 2')).toBeInTheDocument();
  });

  it('should delete level2 on click of delete level button', async () => {
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={jest.fn()} />);
    const { findByText, getByText, getByTestId } = renderComponent;

    await findByText('Select map layer');

    fireEvent.click(getByText('Add level'));

    await findByText('Select map layer');

    const level2 = getByText('Drill Down - Level 2');

    expect(level2).toBeInTheDocument();

    fireEvent.click(getByTestId('delete-button-1'));

    expect(level2).not.toBeInTheDocument();
    expect(mockUnRegisterDatasource).toHaveBeenCalledWith('mapLayerConfig.[1].mapLayer');
  });

  it('should call on submit with selected data', async () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<TestForChoroplethMultiMapLayerConfig onSubmit={onSubmit} />);
    const { findByText, getByTestId, findByTestId, getByText } = renderComponent;

    await findByText('Select map layer');

    selectDropDownOption(renderComponent, 'gisMapLayer-dropdown', 'datasource1');

    expect(api.getCsvHeaders).toHaveBeenCalledWith('d_id1');

    await findByTestId('mapLayerId');

    expect(getByTestId('mapLayerId')).not.toHaveClass('Mui-disabled');

    selectDropDownOption(renderComponent, 'mapLayerId', 'column1');

    selectDropDownOption(renderComponent, 'dataLayerId', 'a');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        mapLayerConfig: [{ mapLayer: 'd_id1', mapLayerId: 'column1', dataLayerId: 'a' }],
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
