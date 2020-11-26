import React from 'react';
import { render } from '@testing-library/react';
import Widget from '../Widget';

describe('<Widget />', () => {
  it('should match snapshot', async () => {
    const { container } = render(<Widget title="Line Chart">Line Chart</Widget>);

    expect(container).toMatchSnapshot();
  });
});
