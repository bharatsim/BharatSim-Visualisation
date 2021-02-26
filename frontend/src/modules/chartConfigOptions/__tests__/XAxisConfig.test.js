import React from 'react';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import XAxisConfig from '../XAxisConfig';

const TestForm = ({ onSubmit }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'xAxis',
  };
  const method = { ...form, defaultValues: {} };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <XAxisConfig configKey={props.configKey} headers={props.headers} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<TimeSliderConfig />', () => {
  const FormForXAxisConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with x axis configs', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForXAxisConfig onSubmit={onSubmit} />);

    await selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');
    await selectDropDownOption(renderedContainer, 'x-axis-type-dropdown', 'Linear');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      { xAxis: { columnName: 'a', type: 'linear' } },
      expect.anything(),
    );
  });

  it('should call on submit with x axis configs with default type', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForXAxisConfig onSubmit={onSubmit} />);

    await selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');
    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      { xAxis: { columnName: 'a', type: '-' } },
      expect.anything(),
    );
  });

  it('should show helper text to show valid date after date type selected', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForXAxisConfig onSubmit={onSubmit} />);
    const { getByText } = renderedContainer;

    await selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');
    await selectDropDownOption(renderedContainer, 'x-axis-type-dropdown', 'Date');

    expect(getByText('Only YYYY-mm-dd HH:MM:SS.sss date format is supported')).toBeInTheDocument();
  });
});
