import React from 'react';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GeoDimensionsConfig from '../GeoDimensionsConfig';

const TestForm = ({ onSubmit }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],

    configKey: 'geoDimensions',
  };
  const methods = { ...form, defaultValues: {} };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GeoDimensionsConfig headers={props.headers} configKey={props.configKey} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<GeoDimensionsConfig />', () => {
  const FormForGeoDimensionsConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with selected lat and longs', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForGeoDimensionsConfig onSubmit={onSubmit} />);

    await selectDropDownOption(renderedContainer, 'longitude', 'a');
    await selectDropDownOption(renderedContainer, 'latitude', 'b');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      { geoDimensions: { latitude: 'b', longitude: 'a' } },
      expect.anything(),
    );
  });
});
