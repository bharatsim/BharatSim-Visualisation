import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GeoDimensionsConfig from '../GeoDimensionsConfig';

const TestForm = ({ onSubmit }) => {
  const { control, errors, handleSubmit } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],

    configKey: 'geoDimensions',
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GeoDimensionsConfig
        control={control}
        headers={props.headers}
        configKey={props.configKey}
        errors={errors[props.configKey]}
      />
      <button type="submit">submit</button>
    </form>
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
