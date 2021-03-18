import React from 'react';
import { render } from '@testing-library/react';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { fireEvent } from '@testing-library/dom';

import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GeoDimensionsConfig from '../GeoDimensionsConfig';
import { FormProvider } from '../../../contexts/FormContext';

const TestForm = ({ onSubmit }) => {
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],

    configKey: 'geoDimensions',
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
            <GeoDimensionsConfig headers={props.headers} configKey={props.configKey} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
        )}
    />
  );
};

describe('<GeoDimensionsConfig />', () => {
  const FormForGeoDimensionsConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with selected lat and longs', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForGeoDimensionsConfig onSubmit={onSubmit} />);

    selectDropDownOption(renderedContainer, 'longitude', 'a');
    selectDropDownOption(renderedContainer, 'latitude', 'b');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { geoDimensions: { latitude: 'b', longitude: 'a' } },
      expect.anything(),
      expect.anything(),
    );
  });
});
