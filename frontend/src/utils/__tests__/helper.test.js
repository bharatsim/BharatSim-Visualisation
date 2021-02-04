import {
  convertObjectArrayToOptionStructure,
  convertStringArrayToOptions,
  debounce,
  getLatLngCenter,
  transformChoroplethData,
  transformDataForHeatMap,
  updateState,
} from '../helper';

describe('Helpers', () => {
  describe('Update state', () => {
    it('should only update state data which is modified', () => {
      const prevState = { a: '1', b: '2' };
      const updatedData = { b: '3' };
      const expectedState = { a: '1', b: '3' };

      const updatedState = updateState(prevState, updatedData);

      expect(updatedState).toEqual(expectedState);
    });
  });

  describe('convertObjectArrayToOptionStructure', () => {
    it('should provide option in value and display name format from array of object ', () => {
      const arrayObject = [
        { a: '1', b: '2' },
        { a: '2', b: '3' },
        { a: '3', b: '4' },
      ];
      const expectedOptions = [
        { displayName: '1', value: '2' },
        { displayName: '2', value: '3' },
        { displayName: '3', value: '4' },
      ];

      const updatedState = convertObjectArrayToOptionStructure(arrayObject, 'a', 'b');

      expect(updatedState).toEqual(expectedOptions);
    });

    it('should provide complete object as values if valueKey is not passed', () => {
      const arrayObject = [
        { a: '1', b: '2' },
        { a: '2', b: '3' },
        { a: '3', b: '4' },
      ];
      const expectedOptions = [
        { value: { a: '1', b: '2' }, displayName: '1' },
        { value: { a: '2', b: '3' }, displayName: '2' },
        { value: { a: '3', b: '4' }, displayName: '3' },
      ];

      const updatedState = convertObjectArrayToOptionStructure(arrayObject, 'a');

      expect(updatedState).toEqual(expectedOptions);
    });
  });

  describe('convertStringArrayToOptions', () => {
    it('should provide option in value and display name format from array of strings', () => {
      const arrayObject = ['a', 'b', 'c'];
      const expectedOptions = [
        { value: 'a', displayName: 'a' },
        { value: 'b', displayName: 'b' },
        { value: 'c', displayName: 'c' },
      ];

      const updatedState = convertStringArrayToOptions(arrayObject);

      expect(updatedState).toEqual(expectedOptions);
    });
  });

  describe('transform Data For HeatMap', () => {
    it('should transform data to [[lat,lan, intensity]] format', () => {
      const data = { lat: [1, 2, 3], lan: [4, 5, 6], geoMetric: [2, 3, 5] };
      const expectedData = [
        [1, 4, 2],
        [2, 5, 3],
        [3, 6, 5],
      ];

      const actualData = transformDataForHeatMap(data, 'lat', 'lan', 'geoMetric');

      expect(actualData).toEqual(expectedData);
    });

    it('should return empty when column is not present', () => {
      const data = { lat: [1, 2, 3], lon: [4, 5, 6], geoMetric: [2, 3, 5] };
      const invalidInputs = [
        [undefined, 'lat', 'lon', 'geoMetric'],
        [data, 'invalidLat', 'lon', 'geoMetric'],
        [data, 'lat', 'invalidLon', 'geoMetric'],
        [data, 'lat', 'lon', 'invalidGeoMetric'],
      ];
      invalidInputs.forEach((inputs) => {
        const actualData = transformDataForHeatMap(...inputs);
        expect(actualData).toEqual([]);
      });
    });
  });

  describe('Debouncing', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.clearAllTimers();
    });
    it('should call function only one time follow debouncing behavior', () => {
      const callback = jest.fn();
      const debounceFunc = debounce(callback, 1000);
      for (let i = 0; i < 100; i += 1) {
        debounceFunc();
      }
      expect(callback).toBeCalledTimes(0);

      jest.runAllTimers();

      expect(callback).toBeCalledTimes(1);
    });
  });

  describe('getLatLang center', () => {
    it('should give center of lat and lang', () => {
      const data = [
        [1.22, 3.44],
        [4.22, 5.234],
        [1.45, 2.44],
      ];

      const actualData = getLatLngCenter(data);

      expect(actualData).toEqual([2.297044263496376, 3.703412118048416]);
    });

    it('should give center of india if no data is present', () => {
      const actualData = getLatLngCenter();

      expect(actualData).toEqual([20.59, 78.96]);
    });

    it('should give center of india if if array is empty', () => {
      const actualData = getLatLngCenter([]);

      expect(actualData).toEqual([20.59, 78.96]);
    });
  });

  describe('transform data for choropleth', () => {
    it('should give transform data for choropleth without time metric', () => {
      const ids = [1, 2, 3, 4];
      const measure = [100, 200, 300, 400];
      const expectedData = {
        1: 100,
        2: 200,
        3: 300,
        4: 400,
      };

      const actualData = transformChoroplethData(ids, measure);

      expect(actualData).toEqual(expectedData);
    });

    it('should give transform data for choropleth with time metric', () => {
      const ids = [1, 2, 3, 4];
      const measure = [100, 200, 300, 400];
      const timeMetric = [1, 1, 2, 2];
      const timeSlider = 2;
      const expectedData = {
        3: 300,
        4: 400,
      };

      const actualData = transformChoroplethData(ids, measure, timeMetric, timeSlider);

      expect(actualData).toEqual(expectedData);
    });
  });
});
