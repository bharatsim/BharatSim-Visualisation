import {
  compareArrayByValues,
  convertObjectArrayToOptionStructure,
  datasourceFileFilter,
  debounce,
  formatToUnits, getIndexForColor,
  getLatLngCenter,
  hexToRgba, maxOf, minOf,
  rgbaToHex,
  shapeFileFilter,
  transformChoroplethData,
  transformColumnsDataToRows,
  transformDataForHeatMap,
  uniqueObjectsBy,
} from '../helper';
import {chartColorsPallet} from "../../theme/colorPalette";
import * as assert from "assert";

describe('Helpers', () => {
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
    it('should give transform data for heatmap with time metric', () => {
      const data = {
        lat: [1, 2, 3, 4],
        lan: [4, 5, 6, 7],
        geoMetric: [2, 3, 5, 7],
        time: [1, 1, 1, 2],
      };
      const expectedData = [[4, 7, 7]];

      const actualData = transformDataForHeatMap(data, 'lat', 'lan', 'geoMetric', 'time', 2);

      expect(actualData).toEqual(expectedData);
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

  describe('formatToUnits', () => {
    it('should format 1000 to 1k', () => {
      expect(formatToUnits(1000)).toEqual('1K');
    });
    it('should format 1000000 to 1M', () => {
      expect(formatToUnits(1000000)).toEqual('1M');
    });
    it('should format 1000000000 to 1M', () => {
      expect(formatToUnits(1000000000)).toEqual('1B');
    });
    it('should format 10023 to 10.023k with 3 as  precision', () => {
      expect(formatToUnits(10023, 3)).toEqual('10.023K');
    });
    it('should format 10000 to 10k with without decimal', () => {
      expect(formatToUnits(10000, 3)).toEqual('10K');
    });
    it('should format 12345 to 12.35k with with decimal', () => {
      expect(formatToUnits(12345, 2)).toEqual('12.35K');
    });
  });

  describe('filter for shape file', () => {
    it('should return false if file is not shape file ', () => {
      const file = { name: 'csv file', fileType: 'csv' };
      const isShapeFile = shapeFileFilter(file);

      expect(isShapeFile).toEqual(false);
    });

    it('should return true if file is shape file ', () => {
      const file = { name: 'json file', fileType: 'geojson' };
      const isShapeFile = shapeFileFilter(file);

      expect(isShapeFile).toEqual(true);
    });
  });

  describe('filter for datasource file', () => {
    it('should return false if file is not datasource file ', () => {
      const file = { name: 'json file', fileType: 'json' };
      const isDatasourceFile = datasourceFileFilter(file);

      expect(isDatasourceFile).toEqual(false);
    });

    it('should return true if file is datasource file ', () => {
      const file = { name: 'csv file', fileType: 'csv' };
      const isDatasourceFile = datasourceFileFilter(file);

      expect(isDatasourceFile).toEqual(true);
    });
  });

  describe('uniqueObjectsBy', () => {
    it('should unique object from array of object by given property name ', () => {
      const files = [
        { name: 'csv file 1', fileType: 'csv1' },
        { name: 'csv file 2', fileType: 'csv2' },
        { name: 'csv file 1', fileType: 'csv3' },
      ];
      const uniqueFilesByFileName = uniqueObjectsBy(files, 'name');

      expect(uniqueFilesByFileName).toEqual([
        { name: 'csv file 1', fileType: 'csv1' },
        { name: 'csv file 2', fileType: 'csv2' },
      ]);
    });
  });

  describe('hexToRgba', () => {
    it('should return rgba of given hex', () => {
      const hex = '#ea3535';
      const rgba = hexToRgba(hex);

      expect(rgba).toEqual({
        r: 234,
        g: 53,
        b: 53,
        a: 1,
      });
    });
  });

  describe('hexToRgba', () => {
    it('should return rgba of given hex', () => {
      const expectedHex = '#ea3535';
      const hex = rgbaToHex({
        r: 234,
        g: 53,
        b: 53,
        a: 1,
      });

      expect(hex).toEqual(expectedHex);
    });
  });
  describe('getIndexForColor', () => {
    it('should get the index of color for defined color palate', () => {
      const totalColors = chartColorsPallet[2]
      const idx1 = getIndexForColor(20,totalColors.length);
      expect(idx1).toEqual(2);

      const idx2 = getIndexForColor(5,totalColors.length);
      expect(idx2).toEqual(5);

      const idx3 = getIndexForColor(9,totalColors.length);
      expect(idx3).toEqual(0);
    });
  })
  describe('minOf', () => {
    it('should return the minimum value from the list', () => {
      const min1 = minOf([10,2,123,131,11,1,12133,1,134,0])
      expect(min1).toEqual(0)

      const min2 = minOf([10,20,123,131,11,1,-100,12133,1,134])
      expect(min2).toEqual(-100)
    });
  })
  describe("maxOf", () => {
    it('should return the minimum value from the list', () => {
      const max1 = maxOf([10,2,123,131,11,1,12133,1,134,0])
      expect(max1).toEqual(12133)

      const max2 = maxOf([10,20,123,131,11,1,12133,1,134,-100,12131414])
      expect(max2).toEqual(12131414)
    });
  })

  describe('transformColumnsDataToRows', () => {
    it('should return array of rows from data with column', () => {
      const data = { col1: [1, 2, 3, 4], col2: [1, 2, 3, 4], col3: [1, 2, 3, 4] };
      const expectedData = [
        { col1: 1, col2: 1, col3: 1 },
        { col1: 2, col2: 2, col3: 2 },
        { col1: 3, col2: 3, col3: 3 },
        { col1: 4, col2: 4, col3: 4 },
      ];

      expect(transformColumnsDataToRows(data)).toEqual(expectedData);
    });
  });

  describe('compare array by values', () => {
    it('should return false if one of the array is undefined', () => {
      const array1 = [];
      const array2 = undefined;

      expect(compareArrayByValues(array1, array2)).toBeFalsy();
    });

    it('should return false if both of the array is undefined', () => {
      const array1 = undefined;
      const array2 = undefined;

      expect(compareArrayByValues(array1, array2)).toBeFalsy();
    });

    it('should return false if arrays have mismatch length', () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2];

      expect(compareArrayByValues(array1, array2)).toBeFalsy();
    });

    it('should return false if array has different values', () => {
      const array1 = ['1', '2', '3'];
      const array2 = ['5', '2', '4'];

      expect(compareArrayByValues(array1, array2)).toBeFalsy();
    });

    it('should return true if array has similar values in same order', () => {
      const array1 = ['1', '2', '3'];
      const array2 = ['1', '2', '3'];

      expect(compareArrayByValues(array1, array2)).toBeTruthy();
    });

    it('should return true if array has similar values in different order', () => {
      const array1 = ['1', '2', '3'];
      const array2 = ['2', '3', '1'];

      expect(compareArrayByValues(array1, array2)).toBeTruthy();
    });
  });
});
