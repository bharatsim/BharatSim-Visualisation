import { getNewWidgetLayout } from '../dashboardLayoutUtils';

describe('Dashboard layout utils', () => {
  describe('getNewWidgetLayout', () => {
    it('should provide layout for newly added widget', () => {
      const numberOfWidgetAdded = 2;
      const cols = 12;
      const count = 2;

      const layout = getNewWidgetLayout(numberOfWidgetAdded, cols, count);

      expect(layout).toEqual({
        i: 'widget-2',
        x: 0,
        y: Infinity,
        w: 6,
        h: 2,
      });
    });
  });
});
