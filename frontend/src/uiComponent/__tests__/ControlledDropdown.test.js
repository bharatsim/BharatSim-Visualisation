import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import withThemeProvider from '../../theme/withThemeProvider';
import ControlledDropDown from '../ControlledDropdown';

const FormWithControlledDropdown = ({ onSubmit, validations }) => {
  const { control, errors, handleSubmit } = useForm({ mode: 'onChange' });
  const options = [
    { value: 'one', displayName: 'one' },
    { value: 'two', displayName: 'two' },
    { value: 'three', displayName: 'three' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledDropDown
        label="select value"
        id="dropdown"
        control={control}
        name="dropdown"
        options={options}
        validations={validations}
        error={errors.dropdown}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<ControlledDropDown  />', () => {
  const DemoForm = withThemeProvider(FormWithControlledDropdown);

  it('Should create a dropdown with provided options', () => {
    const { getAllByRole } = render(
      <DemoForm onSubmit={jest.fn()} validations={{ required: true }} />,
    );

    const button = getAllByRole('button')[0];
    fireEvent.mouseDown(button);

    expect(document.querySelector('ul')).toMatchSnapshot();
  });

  it('Should show error if error message is present', async () => {
    const { getByText } = render(
      <DemoForm onSubmit={jest.fn()} validations={{ required: 'Required' }} />,
    );

    await act(async () => {
      fireEvent.click(getByText('submit'));
    });

    expect(getByText('Required')).toBeInTheDocument();
  });

  it('Should show empty error if error message is not present  with validation ', async () => {
    const { queryByText, getByText, getByTestId } = render(
      <DemoForm onSubmit={jest.fn()} validations={{ required: true }} />,
    );

    await act(async () => {
      fireEvent.click(getByText('submit'));
    });

    expect(queryByText('Required')).toBeNull();
    expect(getByTestId('dropdown')).toHaveClass('Mui-error');
  });
});
