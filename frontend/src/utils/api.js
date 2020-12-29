import { contentTypes, httpMethods } from '../constants/fetch';
import { url as serviceURL } from './url';
import { fetchData, uploadData } from './fetch';

function headerBuilder({ contentType }) {
  return {
    'content-type': contentType,
  };
}

function formDataBuilder(data) {
  const formData = new FormData();
  data.forEach(({ name, value }) => formData.append(name, value));
  return formData;
}

const api = {
  saveDashboard: async ({ charts, layout, dashboardId, name, count }) => {
    return uploadData({
      url: serviceURL.DASHBOARD_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: { charts, layout, dashboardId, name, count },
      }),
      isCustomErrorHandler: true,
      isCustomLoader: true,
    });
  },

  addNewDashboard: async ({ name, projectId }) => {
    return uploadData({
      url: serviceURL.INSERT_DASHBOARD,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: { widgets: [], layout: [], name, count: 0, projectId },
      }),
      isCustomErrorHandler: true,
    });
  },

  getAllDashBoardByProjectId: async (projectId) =>
    fetchData({
      url: serviceURL.DASHBOARD_URL,
      query: { projectId, columns: ['name', '_id'] },
    }),

  getDashboard: async (dashboardId) =>
    fetchData({
      url: serviceURL.getDashboardUrl(dashboardId),
    }),

  deleteDashboard: async (dashboardId) =>
    fetchData({
      url: serviceURL.getDashboardUrl(dashboardId),
      isCustomErrorHandler: true,
      method: httpMethods.DELETE,
    }),
  deleteProject: async (projectId) =>
    fetchData({
      url: serviceURL.getProjectUrl(projectId),
      isCustomErrorHandler: true,
      method: httpMethods.DELETE,
    }),
  deleteDatasource: async (datasourceIds) => {
    return fetchData({
      url: serviceURL.DATA_SOURCES,
      method: httpMethods.DELETE,
      isCustomErrorHandler: true,
      query: { datasourceIds },
    });
  },

  getAllDashBoard: async () => fetchData({ url: serviceURL.DASHBOARD_URL }),

  uploadFileAndSchema: async ({ file, schema, dashboardId }) =>
    uploadData({
      url: serviceURL.DATA_SOURCES,
      data: formDataBuilder([
        { name: 'datafile', value: file },
        { name: 'schema', value: JSON.stringify(schema) },
        { name: 'dashboardId', value: dashboardId },
      ]),
      headers: headerBuilder({ contentType: contentTypes.FILE }),
    }),

  getCsvHeaders: async (dataSourceId) =>
    fetchData({
      url: serviceURL.getHeaderUrl(dataSourceId),
      isCustomErrorHandler: true,
      isCustomLoader: true,
    }),

  getDatasources: async (dashboardId, isCustomLoader = true, isCustomErrorHandler = true) =>
    fetchData({
      url: serviceURL.DATA_SOURCES,
      query: { dashboardId },
      isCustomLoader,
      isCustomErrorHandler,
    }),

  getDatasourcesForProject: async (projectId) =>
    fetchData({
      url: serviceURL.DATA_SOURCES,
      query: { projectId },
    }),

  getData: async (datasource, columns) =>
    fetchData({
      url: serviceURL.getDataUrl(datasource),
      query: { columns },
      isCustomLoader: true,
      isCustomErrorHandler: true,
    }),

  saveProject: async ({ id, ...data }) => {
    const requestObject = {
      url: serviceURL.PROJECT_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      isCustomErrorHandler: true,
    };
    if (id) {
      return uploadData({
        ...requestObject,
        data: JSON.stringify({ projectData: { ...data, id } }),
        method: httpMethods.PUT,
      });
    }
    return uploadData({
      ...requestObject,
      data: JSON.stringify({ projectData: { ...data } }),
      method: httpMethods.POST,
    });
  },

  getProjects: async () => {
    return fetchData({
      url: serviceURL.PROJECT_URL,
    });
  },
  getProject: async (id) => {
    return fetchData({
      url: serviceURL.getProjectUrl(id),
    });
  },
};

export { api };
