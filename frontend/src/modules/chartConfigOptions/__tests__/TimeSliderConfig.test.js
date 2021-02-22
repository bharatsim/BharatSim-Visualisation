import React from 'react';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import TimeSliderConfig from '../TimeSliderConfig';

const TestForm = ({ onSubmit }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit } = form;
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'sliderConfig',
  };
  const method = { ...form, defaultValues: {} };
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TimeSliderConfig configKey={props.configKey} headers={props.headers} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<TimeSliderConfig />', () => {
  const FormForTimeSliderConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with time slider configs with default intervals', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, findByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await findByTestId('timeMetrics');

    await selectDropDownOption(renderedContainer, 'timeMetrics', 'a');

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      { sliderConfig: { timeConfigToggle: true, timeMetrics: 'a', strategy: 'defaultIntervals' } },
      expect.anything(),
    );
  });
  it('should call on submit with time slider configs with defined stepSize intervals', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, findByTestId, getAllByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await findByTestId('timeMetrics');

    await selectDropDownOption(renderedContainer, 'timeMetrics', 'a');

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    const stepSizeInputBox = getByTestId('stepsize-input-box');
    fireEvent.input(stepSizeInputBox, { target: { value: 2 } });

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        sliderConfig: {
          timeConfigToggle: true,
          timeMetrics: 'a',
          stepSize: '2',
          strategy: 'stepSize',
        },
      },
      expect.anything(),
    );
  });
  it('should show error if stepSize value set to empty', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, findByTestId, getAllByRole, getByTestId, findByText } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await findByTestId('timeMetrics');

    await selectDropDownOption(renderedContainer, 'timeMetrics', 'a');

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    const stepSizeInputBox = getByTestId('stepsize-input-box');
    fireEvent.input(stepSizeInputBox, { target: { value: 0 } });

    const requiredMessage = await findByText('step size should not be less than 1');

    expect(requiredMessage).toBeInTheDocument();
  });

  it('should show time slider config if toggle is on', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, findByTestId, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await findByTestId('timeMetrics');

    expect(getByTestId('timeMetrics')).toBeInTheDocument();
  });

  it('should not show time slider config if toggle is off', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { queryByTestId } = renderedContainer;

    expect(queryByTestId('timeMetrics')).not.toBeInTheDocument();
  });
});
