import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import TimeSliderConfig from '../TimeSliderConfig';

const TestForm = ({ onSubmit }) => {
  const { control, errors, handleSubmit, register, watch } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'sliderConfig',
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimeSliderConfig
        control={control}
        register={register}
        watch={watch}
        configKey={props.configKey}
        headers={props.headers}
        errors={errors[props.configKey]}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<TimeSliderConfig />', () => {
  const FormForTimeSliderConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with time slider configs', async () => {
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
      { sliderConfig: { timeConfigToggle: true, timeMetrics: 'a' } },
      expect.anything(),
    );
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
