import React from 'react';
import { render } from '@testing-library/react';

import { fireEvent } from '@testing-library/dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import MapLayerSelector from '../MapLayerSelector';
import { FormProvider } from '../../../contexts/FormContext';

jest.mock('../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1' },
        { name: 'datasource2', _id: 'id2' },
      ],
    }),
  },
}));

const TestForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    mutators={{ ...arrayMutators }}
    render={({ handleSubmit }) => (
      <FormProvider
        value={{
          isEditMode: false,
          registerDatasource: jest.fn(),
          unRegisterDatasource: jest.fn(),
        }}
      >
        <form onSubmit={handleSubmit}>
          <MapLayerSelector />
          <button type="submit">submit</button>
        </form>
      </FormProvider>
    )}
  />
);

describe('<MapLayerSelector />', () => {
  const MapLayerSelectorConfig = withRouter(withProjectLayout(withThemeProvider(TestForm)));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with time slider configs with default intervals', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<MapLayerSelectorConfig onSubmit={onSubmit} />);
    const { findByText } = renderedContainer;

    await findByText('Select GIS shape layer source');

    selectDropDownOption(renderedContainer, 'gisShapeLayer-dropdown', 'datasource1');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { gisShapeLayer: 'id1' },
      expect.anything(),
      expect.anything(),
    );
  });
});
