import React from 'react';
import { render } from '@testing-library/react';
import * as leaflet from 'react-leaflet';
import ResizeController from '../../mapLayers/ResizeController';

jest.mock('react-leaflet');

describe('<ResizeController />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should call invalidate size to resize map container', () => {
    const mockInvalidateSize = jest.fn();
    leaflet.useMap.mockReturnValue({ invalidateSize: mockInvalidateSize });
    render(<ResizeController />);

    jest.runAllTimers();

    expect(mockInvalidateSize).toHaveBeenCalled();
  });
});
