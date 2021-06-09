import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import withThemeProvider from '../../../theme/withThemeProvider';
import SwitchField from '../../formField/SwitchField';

const TestForm = ({ onSubmit, defaultValue }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SwitchField
          onLabel="on"
          offLabel="off"
          name="switch"
          dataTestId="switch"
          defaultValue={defaultValue}
        />
        <button type="submit">submit</button>
      </form>
    )}
  />
);

describe('<RadioButtonField  />', () => {
  const SwitchFieldForm = withThemeProvider(TestForm);

  it('Should return selected value', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<SwitchFieldForm onSubmit={onSubmit} defaultValue={false} />);
    const { getByText, getByRole } = renderComponent;

    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({ switch: true }, expect.anything(), expect.anything());
  });

  it('Should return default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<SwitchFieldForm onSubmit={onSubmit} defaultValue={false} />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith({ switch: false }, expect.anything(), expect.anything());
  });
});
