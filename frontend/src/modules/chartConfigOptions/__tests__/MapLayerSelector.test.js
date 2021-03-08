import React from 'react';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import MapLayerSelector from '../MapLayerSelector';

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

const TestForm = ({ onSubmit }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
  const mockRegisterDatasource = jest.fn();
  const method = {
    ...form,
    defaultValues: {},
    isEditMode: false,
    registerDatasource: mockRegisterDatasource,
  };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MapLayerSelector />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<MapLayerSelector />', () => {
  const FormForTimeSliderConfig = withRouter(withProjectLayout(withThemeProvider(TestForm)));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with time slider configs with default intervals', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { findByText } = renderedContainer;

    await findByText('select GIS shape layer source');

    await selectDropDownOption(renderedContainer, 'gisShapeLayer-dropdown', 'datasource1');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({ gisShapeLayer: 'id1' }, expect.anything());
  });
});
