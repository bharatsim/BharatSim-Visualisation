import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { format, isAfter } from 'date-fns';

import withThemeProvider from '../../../theme/withThemeProvider';
import DateField from '../../formField/DateField';
import { required } from '../../../utils/validators';
import { DATE_FORMAT, } from '../../../constants/annotations';

jest.mock('@material-ui/pickers', () => ({
  KeyboardDatePicker: jest.fn(({ value, onChange, error, helperText, ...rest }) => (
    <div>
      {/* eslint-disable-next-line no-undef */}
      <pre>{mockPropsCapture(rest)}</pre>
      <input value={value} onChange={onChange} data-testid="date-input" />
      {error && helperText }
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
            validate={(value) => isAfter(new Date(value),new Date('2010, Jan 1')) ? 'Error': ''}
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
  const DateFieldForm = withThemeProvider(TestForm);

  it('Should return selected value', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<DateFieldForm onSubmit={onSubmit} />);
    const { getByText, getByTestId } = renderComponent;

    fireEvent.change(getByTestId('date-input'), { target: { value: '2000-04-04' } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dateField: '2000-04-04' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should return default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DateFieldForm onSubmit={onSubmit} />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dateField: '1900-02-01' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should show error', () => {
    const onSubmit = jest.fn();
    const { getByText, getByTestId } = render(<DateFieldForm onSubmit={onSubmit} />);

    fireEvent.change(getByTestId('date-input'), { target: { value: '2020-04-04' } });

    fireEvent.click(getByText('submit'));

    expect(getByText('Error')).toBeInTheDocument()
  });
});
