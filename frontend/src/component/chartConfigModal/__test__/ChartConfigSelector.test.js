import React from 'react';
import { render } from '@testing-library/react';

import ChartConfigSelector from '../ChartConfigSelector';
import useFetch from '../../../hook/useFetch';

jest.mock('../../../hook/useFetch');

describe('<ChartConfigSelector />', () => {
  beforeEach(() => {
    useFetch.mockReturnValue({
      data: {
        headers: [
          { name: 'a', type: 'number' },
          { name: 'b', type: 'number' },
        ],
      },
      loadingState: 'SUCCESS',
    });
  });

  it('should match snapshot', () => {
    const { container } = render(
      <ChartConfigSelector
        chartType="lineChart"
        dataSourceId="dataSourceId"
        errors={{}}
        updateConfigState={jest.fn()}
        values={{}}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});