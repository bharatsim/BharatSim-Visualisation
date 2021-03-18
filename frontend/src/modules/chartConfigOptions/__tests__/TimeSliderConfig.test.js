import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import TimeSliderConfig from '../TimeSliderConfig';

import { FormProvider } from '../../../contexts/FormContext';

const TestForm = ({ onSubmit }) => {
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'sliderConfig',
  };

  return (
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
            <TimeSliderConfig configKey={props.configKey} headers={props.headers} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
        )}
    />
  );
};

describe('<TimeSliderConfig />', () => {
  const FormForTimeSliderConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with time slider configs with default intervals', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'timeMetrics', 'a');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { sliderConfig: { timeConfigToggle: true, timeMetrics: 'a', strategy: 'defaultIntervals' } },
      expect.anything(),
      expect.anything(),
    );
  });
  it('should call on submit with time slider configs with defined stepSize intervals', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, getAllByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'timeMetrics', 'a');

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    const stepSizeInputBox = getByTestId('stepsize-input-box');
    fireEvent.input(stepSizeInputBox, { target: { value: 2 } });

    fireEvent.click(renderedContainer.getByText('submit'));

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
      expect.anything(),
    );
  });

  it('should show time slider config if toggle is on', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { getByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    expect(getByTestId('timeMetrics')).toBeInTheDocument();
  });

  it('should not show time slider config if toggle is off', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForTimeSliderConfig onSubmit={onSubmit} />);
    const { queryByTestId } = renderedContainer;

    expect(queryByTestId('timeMetrics')).not.toBeInTheDocument();
  });
});
