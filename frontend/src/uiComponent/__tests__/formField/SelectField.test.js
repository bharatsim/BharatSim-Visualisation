import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import withThemeProvider from '../../../theme/withThemeProvider';
import Dropdown from '../../formField/SelectField';
import { required } from '../../../utils/validators';
import { selectDropDownOption } from '../../../testUtil';

const TestForm = ({ onSubmit, defaultValue }) => {
  const options = [
    { value: 'one', displayName: 'one' },
    { value: 'two', displayName: 'two' },
    { value: 'three', displayName: 'three' },
  ];
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Dropdown
            label="select value"
            id="dropdown"
            name="dropdown"
            options={options}
            validate={required}
            defaultValue={defaultValue}
          />
          <button type="submit">submit</button>
        </form>
        )}
    />
  );
};

describe('<DorpdownField  />', () => {
  const DropdownForm = withThemeProvider(TestForm);

  it('Should return selected value', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<DropdownForm onSubmit={onSubmit} />);
    const { getByText } = renderComponent;

    selectDropDownOption(renderComponent, 'dropdown', 'two');

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dropdown: 'two' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should return default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DropdownForm onSubmit={onSubmit} defaultValue="one" />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      { dropdown: 'one' },
      expect.anything(),
      expect.anything(),
    );
  });

  it('Should show error', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DropdownForm onSubmit={onSubmit} />);

    fireEvent.click(getByText('submit'));

    expect(getByText('Field is required')).toBeInTheDocument();
  });
});
