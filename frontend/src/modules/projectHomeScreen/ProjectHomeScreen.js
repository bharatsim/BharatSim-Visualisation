import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClickableCard from '../../uiComponent/ClickableCard';
import useModal from '../../hook/useModal';
import CreateNewDashboardModal from './CreateNewDashboardModal';
import { api } from '../../utils/api';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import snackbarVariant from '../../constants/snackbarVariant';

const useStyles = makeStyles((theme) => {
  return {
    addProjectContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: theme.spacing(66),
      boxSizing: 'border-box',
    },
  };
});

function ProjectHomeScreen() {
  const classes = useStyles();
  const history = useHistory();
  const { openModal, isOpen, closeModal } = useModal();
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
        history.replace({ pathname: `/projects/${savedProjectId}/create-dashboard` });
      });
  }

  async function saveProjectAndDashboard(projectTitle, dashboardTitle) {
    await api.saveProject({ name: projectTitle }).then(({ projectId: newProjectId }) => {
      enqueueSnackbar(`Project ${projectTitle} is saved`, {
        variant: SUCCESS,
      });
      return saveDashboard(newProjectId, projectTitle, dashboardTitle);
    });
  }

  async function onCreate(values) {
    const { 'project-title': projectTitle, 'dashboard-title': dashboardTitle } = values;
    closeModal();
    if (projectMetadata.id) {
      await saveDashboard(projectMetadata.id, projectTitle, dashboardTitle);
      return;
    }
    await saveProjectAndDashboard(projectTitle, dashboardTitle);
  }

  return (
    <Box>
      <ProjectHeader>{projectMetadata.name}</ProjectHeader>
      <Box py={14} px={32}>
        <ClickableCard onClick={openModal}>
          <Box className={classes.addProjectContainer}>
            <Box pb={2}>
              <Typography variant="h6"> You don’t have any dashboards Yet. </Typography>
            </Box>
            <Typography variant="body2"> Click here to create your first dashboard. </Typography>
          </Box>
        </ClickableCard>
      </Box>
      <CreateNewDashboardModal
        isOpen={isOpen}
        closeModal={closeModal}
        onCreate={onCreate}
        onlyDashboardField={!!projectMetadata.id}
      />
    </Box>
  );
}

export default ProjectHomeScreen;
