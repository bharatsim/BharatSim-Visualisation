import React from 'react';
import { render } from '@testing-library/react';
import ChartConfigSelectorStep from '../ChartConfigSelectorStep';

describe('chart config selector', () => {
  it('should match snapshot', () => {
    const { container } = render(<ChartConfigSelectorStep />);

    expect(container).toMatchSnapshot();
  });
});
