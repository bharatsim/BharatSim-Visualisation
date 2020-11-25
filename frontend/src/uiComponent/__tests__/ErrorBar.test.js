import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import withThemeProvider from '../../theme/withThemeProvider';
import ErrorBar from '../ErrorBar';

const ErrorBarWithProvider = withThemeProvider(ErrorBar);

describe('ErrorBar', () => {
  it('should match snapshot', () => {
    const { container } = render(<ErrorBarWithProvider visible message="error message" />);

    expect(container).toMatchSnapshot();
  });

  it('should call onClick of error button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ErrorBarWithProvider visible message="error text" errorAction={{ name: 'test', onClick }} />,
    );

    const button = getByText('test').closest('button');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
