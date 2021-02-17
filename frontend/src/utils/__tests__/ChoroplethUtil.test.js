import chroma from 'chroma-js';
import leaflet from 'leaflet';
import { geoJSONStyle, highlightOnClick, resetHighlight, zoomToFeature } from '../ChoroplethUtil';

jest.mock('leaflet', () => ({
  Browser: {
    chrome: true,
  },
}));

describe('ChoroplethUtils', () => {
  it('should highLight clicked feature by setting styles', () => {
    const event = {
      target: {
        setStyle: jest.fn(),
        bringToFront: jest.fn(),
        Browser: {
          ie: false,
          opera: false,
          edge: false,
          chrome: true,
        },
      },
    };

    highlightOnClick(event);

    expect(event.target.setStyle).toHaveBeenCalledWith({
      weight: 2,
      dashArray: '',
      opacity: 1,
      fillOpacity: 0.7,
    });

    expect(event.target.bringToFront).toHaveBeenCalled();
  });

  it('should not call bring to front when browser is opera, ie, edge', () => {
    leaflet.Browser = {
      ie: true,
    };
    const event = {
      target: {
        setStyle: jest.fn(),
        bringToFront: jest.fn(),
      },
    };

    highlightOnClick(event);

    expect(event.target.bringToFront).not.toHaveBeenCalled();
  });

  it('should call reset highlight to reset style of feature', () => {
    const geoJson = {
      current: {
        resetStyle: jest.fn(),
      },
    };
    const event = {
      target: 'target',
    };

    const onMouseOOutResetHighlight = resetHighlight(geoJson);
    onMouseOOutResetHighlight(event);

    expect(geoJson.current.resetStyle).toHaveBeenCalledWith('target');
  });

  it('should call fits bounds with feature bound to zoom to feature', () => {
    const map = {
      fitBounds: jest.fn(),
    };

    const event = {
      target: { getBounds: jest.fn().mockReturnValue('bounds') },
    };

    const onClickZomToFeature = zoomToFeature(map);
    onClickZomToFeature(event);

    expect(map.fitBounds).toHaveBeenCalledWith('bounds');
    expect(event.target.getBounds).toHaveBeenCalled();
  });

  it('get geo json styles', () => {
    const scale = {
      0.0: 'white',
      0.5: 'blue',
      '1': 'red',
    };
    const idDataMap = { 1: 0, 2: 15, 3: 30 };
    const getFeatureStyle = geoJSONStyle(idDataMap, 'id', 30, scale);
    const feature1 = { properties: { id: 1 } };
    const feature2 = { properties: { id: 2 } };
    const feature3 = { properties: { id: 3 } };

    expect(getFeatureStyle(feature1)).toEqual({
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      opacity: 0.7,
      fillColor: chroma('white'),
    });

    expect(getFeatureStyle(feature2)).toEqual({
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: chroma('blue'),
      opacity: 0.7,
    });

    expect(getFeatureStyle(feature3)).toEqual({
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      opacity: 0.7,
      fillColor: chroma('red'),
    });
  });
});
