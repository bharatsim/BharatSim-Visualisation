import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';

import Dropdown from '../Dropdown';
import withThemeProvider from '../../theme/withThemeProvider';

describe('<Dropdown />', () => {
  const props = {
    options: [
      { value: 'one', displayName: 'one' },
      { value: 'two', displayName: 'two' },
      { value: 'three', displayName: 'three' },
    ],
    id: 'numbers',
    label: 'select number',
    value: '',
    onChange: jest.fn(),
    error: '',
  };

  const DropdownWithTheme = withThemeProvider(Dropdown);

  it('Should match a snapshot', () => {
    const { container } = render(<DropdownWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('Should create a dropdown with provided options', () => {
    const { getByRole } = render(<DropdownWithTheme {...props} />);

    const button = getByRole('button');
    fireEvent.mouseDown(button);

    expect(document.querySelector('ul')).toMatchSnapshot();
  });

  it('Should show selected option after getting value', () => {
    const { getByRole } = render(<DropdownWithTheme {...props} value="two" />);

    const button = getByRole('button');

    expect(button).toHaveTextContent(/Two/i);
  });

  it('Should call onChange callback with selected option', () => {
    const { getByRole } = render(<DropdownWithTheme {...props} />);

    const button = getByRole('button');
    fireEvent.mouseDown(button);

    const optionList = within(document.querySelector('ul'));
    const optionOne = optionList.getByText(/Two/i);
    fireEvent.click(optionOne);

    expect(props.onChange).toHaveBeenCalled();
  });

  it('Should show error if error message is present', () => {
    const { getByRole, getByText } = render(<DropdownWithTheme {...props} error="error" />);

    const button = getByRole('button');
    fireEvent.mouseDown(button);

    const optionList = within(document.querySelector('ul'));
    const optionOne = optionList.getByText(/Two/i);
    fireEvent.click(optionOne);

    expect(getByText('error')).toBeInTheDocument();
  });

  it('Should not show error if error message is not present', () => {
    const { getByRole, queryByText } = render(<DropdownWithTheme {...props} error="" />);

    const button = getByRole('button');
    fireEvent.mouseDown(button);

    const optionList = within(document.querySelector('ul'));
    const optionOne = optionList.getByText(/Two/i);
    fireEvent.click(optionOne);

    expect(queryByText('error')).toBeNull();
  });
});
