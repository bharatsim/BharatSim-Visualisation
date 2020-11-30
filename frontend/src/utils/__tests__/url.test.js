import { url } from '../url';

describe('URL', () => {
  it('should provide a url', () => {
    expect(url).toMatchSnapshot();
  });

  it('should provide a url for headers', () => {
    expect(url.getHeaderUrl('dataSource')).toEqual('/api/dataSources/dataSource/headers');
  });

  it('should provide a url for data', () => {
    expect(url.getDataUrl('dataSource')).toEqual('/api/dataSources/dataSource');
  });
  it('should provide a url for dashboard', () => {
    expect(url.getDashboardUrl('dashboardId')).toEqual('/api/dashboard/dashboardId');
  });
  it('should provide a url for project', () => {
    expect(url.getProjectUrl('projectId')).toEqual('/api/projects/projectId');
  });
});
