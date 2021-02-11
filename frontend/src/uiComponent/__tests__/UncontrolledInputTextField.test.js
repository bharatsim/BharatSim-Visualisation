import { useForm } from 'react-hook-form';
import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import UncontrolledInputTextField from '../UncontrolledInputField';
import withThemeProvider from '../../theme/withThemeProvider';

const UncontrolledInputTextFieldWithProviders = withThemeProvider(UncontrolledInputTextField);

const FormForInputTextField = ({ onSubmit, inputLabel }) => {
  const { errors, handleSubmit, register } = useForm({ mode: 'onChange' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UncontrolledInputTextFieldWithProviders
        name="name"
        register={register}
        type="text"
        error={errors.name}
        helperText="helperText"
        defaultValue="def"
        label={inputLabel}
        validations={{
          required: true,
          maxLength: { value: 5, message: 'max length 5' },
          minLength: 3,
        }}
        dataTestid="dataTestid"
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<UncontrolledInputTextField />', () => {
  it('should change value', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <FormForInputTextField inputLabel="" onSubmit={onSubmit} />,
    );

    const input = getByTestId('dataTestid');
    fireEvent.input(input, { target: { value: 'name' } });
    await act(async () => {
      fireEvent.click(getByText('submit'));
    });
    expect(onSubmit).toHaveBeenCalledWith({ name: 'name' }, expect.anything());
  });
  it('should show helper text', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForInputTextField inputLabel="" onSubmit={onSubmit} />);

    expect(getByText('helperText')).toBeInTheDocument();
  });
  it('should show label', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <FormForInputTextField inputLabel="inputLabel" onSubmit={onSubmit} />,
    );

    expect(getByText('inputLabel')).toBeInTheDocument();
  });
  it('should show error if any validation fails', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <FormForInputTextField inputLabel="" onSubmit={onSubmit} />,
    );

    const input = getByTestId('dataTestid');
    fireEvent.input(input, { target: { value: 'biggerName' } });
    await act(async () => {
      fireEvent.click(getByText('submit'));
    });
    expect(getByText('max length 5')).toBeInTheDocument();
  });

  it('should show empty error if message is not present', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <FormForInputTextField inputLabel="" onSubmit={onSubmit} />,
    );
    const helpertextContainer = getByText('helperText');

    const input = getByTestId('dataTestid');
    fireEvent.input(input, { target: { value: 'sm' } });
    await act(async () => {
      fireEvent.click(getByText('submit'));
    });

    // eslint-disable-next-line no-irregular-whitespace
    expect(helpertextContainer.innerHTML).toMatchInlineSnapshot(`"<span>​</span>"`);
    expect(helpertextContainer).toHaveClass('Mui-error');
  });
});
