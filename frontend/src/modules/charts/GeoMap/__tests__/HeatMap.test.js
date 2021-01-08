import React from 'react';
import { render } from '@testing-library/react';
import HeatMap from '../HeatMap';

jest.mock('../../../../utils/api', () => ({
  api: {
    getData: jest.fn().mockResolvedValue({
      data: { lat: [2, 3], long: [1, 2], dataPoints: [2, 3] },
    }),
  },
}));

describe('HeatMap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // TODO - snapshot is not as expected

  it('should create a heatmap component', async () => {
    const { container, findByTestId } = render(
      <div style={{ height: '100px', width: '100px' }}>
        <HeatMap
          config={{
            dataSource: 'test.csv',
            latitude: 'lat',
            longitude: 'long',
            geoMetricSeries: 'dataPoints',
          }}
        />
        ,
      </div>,
    );
    await findByTestId('map-container');
    expect(container).toMatchSnapshot();
  });
});
