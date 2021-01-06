import React from 'react';
import { render } from '@testing-library/react';
import HeatMap from '../HeatMap';

describe('HeatMap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a heatmap component', async () => {
    const { container } = render(
      <HeatMap />,
    );

    expect(container).toMatchSnapshot();
  });
});