import { contentTypes, httpMethods } from '../constants/fetch';
import { url as serviceURL } from './url';
import { fetchData, uploadData } from './fetch';
import loaderAndErrorMessages from '../constants/loaderAndErrorMessages';

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
  saveDashboard: async ({ widgets, layout, dashboardId, name, count }) => {
    return uploadData({
      url: serviceURL.DASHBOARD_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: { widgets, layout, dashboardId, name, count },
      }),
      messages: loaderAndErrorMessages.saveDashboard(name),
    });
  },

  addNewDashboard: async ({ name, projectId }) => {
    return uploadData({
      url: serviceURL.INSERT_DASHBOARD,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: { widgets: [], layout: [], name, count: 0, projectId },
      }),
      messages: loaderAndErrorMessages.addDashboard(name),
    });
  },

  getAllDashBoardByProjectId: async (projectId) =>
    fetchData({
      url: serviceURL.DASHBOARD_URL,
      query: { projectId, columns: ['name', '_id'] },
      messages: loaderAndErrorMessages.loadDashboards(),
    }),

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
      messages: loaderAndErrorMessages.fileUpload(file.name),
    }),

  getCsvHeaders: async (dataSourceId) => fetchData({ url: serviceURL.getHeaderUrl(dataSourceId) }),

  getDatasources: async (dashboardId) =>
    fetchData({
      url: serviceURL.DATA_SOURCES,
      query: { dashboardId },
      messages: loaderAndErrorMessages.fetchDatasources(),
    }),

  getData: async (datasource, columns) =>
    fetchData({ url: serviceURL.getDataUrl(datasource), query: { columns } }),

  saveProject: async ({ id, ...data }) => {
    const messages = loaderAndErrorMessages.saveProject(data.name);
    const requestObject = {
      url: serviceURL.PROJECT_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      messages,
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
      messages: loaderAndErrorMessages.loadProjects(),
    });
  },
  getProject: async (id) => {
    return fetchData({
      url: serviceURL.getProjectUrl(id),
      messages: loaderAndErrorMessages.loadProject(),
    });
  },
};

export { api };
