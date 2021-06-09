import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import withThemeProvider from '../../../theme/withThemeProvider';
import RadioButtonField from '../../formField/RadioButtonField';
import { required } from '../../../utils/validators';

const TestForm = ({ onSubmit, defaultValue }) => {
  const options = [
    { value: 'one', label: 'one' },
    { value: 'two', label: 'two' },
    { value: 'three', label: 'three' },
  ];

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <RadioButtonField
            name="radio"
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

describe('<RadioButtonField  />', () => {
  const RadioButtonFieldForm = withThemeProvider(TestForm);

  it('Should return selected value', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<RadioButtonFieldForm onSubmit={onSubmit} defaultValue="two" />);
    const { getByText, getAllByRole } = renderComponent;

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    fireEvent.change(radioButtons[0], { target: { checked: true } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({ radio: 'one' }, expect.anything(), expect.anything());
  });

  it('Should return default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<RadioButtonFieldForm onSubmit={onSubmit} defaultValue="two" />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({ radio: 'two' }, expect.anything(), expect.anything());
  });
});
