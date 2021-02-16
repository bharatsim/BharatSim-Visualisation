import React from 'react';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import RadioButtons from '../RadioButtons';

const TestForm = ({ onSubmit, vertical }) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioButtons
        options={[
          { value: 'option1', label: 'option1' },
          { value: 'option2', label: 'option2' },
        ]}
        control={control}
        defaultValue="option1"
        name="radioButtons"
        vertical={vertical}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<RadioButtons />', () => {
  it('should match snapshot vertical direction', () => {
    const { container } = render(<TestForm onSubmit={jest.fn()} vertical />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot horizontal direction', () => {
    const { container } = render(<TestForm onSubmit={jest.fn()} vertical={false} />);

    expect(container).toMatchSnapshot();
  });
});
