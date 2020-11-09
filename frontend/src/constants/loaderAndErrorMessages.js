const loaderAndErrorMessages = {
  saveDashboard: (dashboardName) => ({
    loading: 'Saving Dashboard...',
    errorTitle: `Aw Snap! Failed to save dashboard ${dashboardName}`,
    helperText: `failed to save dashboard ${dashboardName}`,
  }),
  addDashboard: (dashboardName) => ({
    loading: `Adding Dashboard ${dashboardName}`,
    errorTitle: `Aw Snap! Failed to add dashboard ${dashboardName}`,
    helperText: 'Try to adding again or reload the page',
  }),
  loadDashboards: () => ({
    loading: `Loading Dashboards...`,
    errorTitle: `Aw Snap! Failed to load dashboards.`,
    helperText: 'Try to reload the page',
  }),
  fileUpload: (fileName) => ({
    loading: `Uploading file ${fileName}`,
    errorTitle: `Aw Snap! Failed to upload the file ${fileName}`,
    helperText: 'Try to upload again',
  }),
  fetchDatasources: () => ({
    loading: `Fetching data sources...`,
    errorTitle: `Aw Snap! Failed to fetch data sources.`,

    helperText: 'Try to reloading the page',
  }),
  loadProjects: () => ({
    loading: 'Loading Projects...',
    errorTitle: 'Aw Snap! Something went wrong while loading projects',
    helperText: 'Failed to load projects try to reload',
  }),
  loadProject: () => ({
    loading: 'Loading Project...',
    errorTitle: 'Aw Snap! Something went wrong while loading project',
    helperText: 'Failed to load project try to reload',
  }),
  saveProject: (projectName) => ({
    loading: `Saving project  ${projectName}`,
    errorTitle: `Aw Snap! Failed to save project.`,
    helperText: 'Try to save again',
  }),
};

export default loaderAndErrorMessages;
