import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { format } from 'date-fns';

import withThemeProvider from '../../../theme/withThemeProvider';
import DateField from '../../formField/DateField';
import { required } from '../../../utils/validators';
import { DATE_FORMAT } from '../../../constants/annotations';

jest.mock('@material-ui/pickers', () => ({
  KeyboardDatePicker: jest.fn(({ value, onChange, ...rest }) => (
    <div>
      {/* eslint-disable-next-line no-undef */}
      <pre>{mockPropsCapture(rest)}</pre>
      <input value={value} onChange={onChange} data-testid="date-input" />
    </div>
  )),
}));

const TestForm = ({ onSubmit, isEditMode }) => {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <DateField
            name="dateField"
            label="To Value"
            dataTestId="end-input"
            validate={required}
            isEditMode={isEditMode}
            defaultValue={format(new Date(1900, 1, 1, 0, 0, 0, 0), DATE_FORMAT)}
            format={DATE_FORMAT}
          />
          <button type="submit">submit</button>
        </form>
      )}
    />
  );
};

describe('<DateField  />', () => {
  const DropdownForm = withThemeProvider(TestForm);

  it('Should return selected value', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<DropdownForm onSubmit={onSubmit} />);
    const { getByText, getByTestId } = renderComponent;

    fireEvent.change(getByTestId('date-input'), { target: { value: '2020-04-04' } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dateField: '2020-04-04' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should return default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DropdownForm onSubmit={onSubmit} defaultValue="one" />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dateField: '1900-02-01' },
      expect.anything(),
      expect.anything(),
    );
  });
});
