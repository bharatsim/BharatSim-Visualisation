import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { selectDropDownOption } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import HeaderSelector from '../HeaderSelector';
import { FormProvider } from '../../../contexts/FormContext';

const TestForm = ({ onSubmit }) => {
  const props = {
    id: 'gis-measure',
    label: 'select measure',
    title: 'GIS Measure',
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'gisMeasure',
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
            <HeaderSelector {...props} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
        )}
    />
  );
};

describe('<HeaderSelector />', () => {
  const FormForChartConfigDropdown = withThemeProvider(TestForm);
  it('should call setConfig callback after value change', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForChartConfigDropdown onSubmit={onSubmit} />);

    selectDropDownOption(renderedContainer, 'gis-measure', 'a');

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { gisMeasure: 'a' },
      expect.anything(),
      expect.anything(),
    );
  });
});
