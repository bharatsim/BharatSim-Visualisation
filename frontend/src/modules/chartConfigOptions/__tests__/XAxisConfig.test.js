import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import XAxisConfig from '../XAxisConfig';
import { FormProvider } from '../../../contexts/FormContext';

const TestForm = ({ onSubmit }) => {
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'xAxis',
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
            <XAxisConfig configKey={props.configKey} headers={props.headers} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
        )}
    />
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

    selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');
    selectDropDownOption(renderedContainer, 'x-axis-type-dropdown', 'Linear');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { xAxis: { columnName: 'a', type: 'linear' } },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call on submit with x axis configs with default type', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForXAxisConfig onSubmit={onSubmit} />);

    selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { xAxis: { columnName: 'a', type: '-' } },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should show helper text to show valid date after date type selected', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForXAxisConfig onSubmit={onSubmit} />);
    const { getByText } = renderedContainer;

    selectDropDownOption(renderedContainer, 'x-axis-dropdown', 'a');
    selectDropDownOption(renderedContainer, 'x-axis-type-dropdown', 'Date');

    expect(getByText('Only YYYY-mm-dd HH:MM:SS.sss date format is supported')).toBeInTheDocument();
  });
});
