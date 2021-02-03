import React from 'react';
import { render } from '@testing-library/react';
import AntSwitch from '../AntSwitch';

describe('<AntSwitch />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <AntSwitch onChange={jest.fn()} checked offLabel="OFF" onLabel="ON" />,
    );

    expect(container).toMatchSnapshot();
  });
});
