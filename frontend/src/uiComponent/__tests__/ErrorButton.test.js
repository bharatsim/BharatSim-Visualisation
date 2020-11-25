import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../theme/withThemeProvider';
import ErrorButton from '../ErrorButton';

const ErrorButtonWithProvider = withThemeProvider(ErrorButton);

describe('ErrorButton', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <ErrorButtonWithProvider onClick={jest.fn}>Test </ErrorButtonWithProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call onClick', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ErrorButtonWithProvider onClick={onClick}>Test</ErrorButtonWithProvider>,
    );

    const button = getByText('Test').closest('button');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
