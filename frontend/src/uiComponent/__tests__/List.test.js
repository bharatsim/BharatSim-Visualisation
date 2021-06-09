import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import List from '../List';
import withThemeProvider from '../../theme/withThemeProvider';

const ListWithProvider = withThemeProvider(List);

describe('<List />', () => {
  it('should match snapshot with list item', () => {
    const { container } = render(
      <ListWithProvider onClick={jest.fn()} listItem={['field1', 'field2']} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call onClick callback on click of any list item', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ListWithProvider onClick={onClick} listItem={['field1', 'field2']} />,
    );

    fireEvent.click(getByText('field1'));

    expect(onClick).toHaveBeenCalled();
  });
});
