import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { overlayLoaderOrErrorContext } from '../contexts/overlayLoaderOrErrorContext';
import snackbarVariant from '../constants/snackbarVariant';
import { api } from '../utils/api';
import { errors, errorTypes } from '../constants/loaderAndErrorMessages';
import { projectLayoutContext } from '../contexts/projectLayoutContext';

function useCreateDashboard() {
  const history = useHistory();
  const { showError } = useContext(overlayLoaderOrErrorContext);
  const { projectMetadata, addDashboard } = useContext(projectLayoutContext);
  const { enqueueSnackbar } = useSnackbar();
  const { SUCCESS } = snackbarVariant;

  async function saveDashboard(savedProjectId, projectTitle, dashboardTitle) {
    await api
      .addNewDashboard({ name: dashboardTitle, projectId: savedProjectId })
      .then(({ dashboardId }) => {
        enqueueSnackbar(`Dashboard ${dashboardTitle} is saved`, {
          variant: SUCCESS,
        });
        addDashboard({ _id: dashboardId, name: dashboardTitle });
        history.replace({ pathname: `/projects/${savedProjectId}/configure-dataset` });
      })
      .catch(() => {
        showError(errors[errorTypes.DASHBOARD_CREATE_FAILED](dashboardTitle));
        if (!projectMetadata.id) {
          history.replace({ pathname: `/projects/${savedProjectId}/create-dashboard` });
        }
      });
  }
  async function saveProjectAndDashboard(projectTitle, dashboardTitle) {
    await api
      .saveProject({ name: projectTitle })
      .then(({ projectId: newProjectId }) => {
        enqueueSnackbar(`Project ${projectTitle} is saved`, {
          variant: SUCCESS,
        });
        return saveDashboard(newProjectId, projectTitle, dashboardTitle);
      })
      .catch(() => {
        const errorConfigs = errors[errorTypes.PROJECT_AND_DASHBOARD_CREATE_FAILED](
          projectTitle,
          dashboardTitle,
        );
        showError(errorConfigs);
      });
  }
  async function createDashboard(values) {
    const { 'project-title': projectTitle, 'dashboard-title': dashboardTitle } = values;
    if (projectMetadata.id) {
      await saveDashboard(projectMetadata.id, projectTitle, dashboardTitle);
      return;
    }
    await saveProjectAndDashboard(projectTitle, dashboardTitle);
  }
  return { createDashboard };
}

export default useCreateDashboard;
