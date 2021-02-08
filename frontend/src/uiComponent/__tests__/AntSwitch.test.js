import React from 'react';
import { act, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';
import AntSwitch from '../AntSwitch';

const FormWithAntSwitch = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AntSwitch control={control} name="switch" dataTestid="switch" offLabel="on" onLabel="off" />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<AntSwitch />', () => {
  it('should call on submit with ant switch value', async () => {
    const onSubmit = jest.fn();
    const { getByRole, getByText } = render(<FormWithAntSwitch onSubmit={onSubmit} />);

    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await act(async () => {
      fireEvent.click(getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        switch: true,
      },
      expect.anything(),
    );
  });
});
