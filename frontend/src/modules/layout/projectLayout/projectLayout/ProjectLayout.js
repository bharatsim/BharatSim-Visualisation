import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box } from '@material-ui/core';
import DashboardNavbar from '../sideDashboardNavbar/DashboardNavbar';

import useProjectLayoutStyle from './projectLayoutCSS';

import { api } from '../../../../utils/api';
import { ProjectLayoutProvider } from '../../../../contexts/projectLayoutContext';
import { ChildrenPropTypes } from '../../../../commanPropTypes';

function ProjectLayout({ children }) {
  const classes = useProjectLayoutStyle();
  const { id: projectId } = useParams();
  const history = useHistory();

  const [projectMetadata, setProjectMetadata] = useState({
    id: null,
    name: 'untitled project',
  });

  const [dashboards, setDashboards] = useState(undefined);
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (projectId) {
        const fetchedProject = await api.getProject(projectId);
        const { _id, name } = fetchedProject.project;
        setProjectMetadata({ id: _id, name });
      }
    }
    fetchData();
  }, [projectId]);

  useEffect(() => {
    async function fetchData() {
      if (projectId) {
        const fetchedDashboards = await api.getAllDashBoardByProjectId(projectId);
        setDashboards(fetchedDashboards.dashboards);
      }
    }
    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      history.push(`/projects/${projectId}/dashboard`);
    }
  }, [projectId, selectedDashboard]);

  useEffect(() => {
    if (dashboards && dashboards.length === 0) {
      history.replace({ pathname: `/projects/${projectId}/create-dashboard` });
    }
  }, [dashboards, projectId]);

  function addDashboard(dashboard) {
    const prevDashboards = dashboards || [];
    setDashboards([...prevDashboards, dashboard]);
    const nextDashboardIndex = prevDashboards.length;
    setSelectedDashboard(nextDashboardIndex);
  }

  function deleteDashboard(selectedDashboardId) {
    const updatedDashboards = dashboards.filter(
      ({ _id: dashboardId }) => dashboardId !== selectedDashboardId,
    );
    setDashboards(updatedDashboards);
  }

  if (projectId && (!dashboards || !projectMetadata.id)) {
    return null;
  }

  return (
    <Box className={classes.layoutContainer}>
      <ProjectLayoutProvider
        value={{
          projectMetadata,
          selectedDashboardMetadata: (dashboards && dashboards[selectedDashboard]) || {},
          addDashboard,
          deleteDashboard,
        }}
      >
        <Box className={classes.sideBarLayout}>
          <DashboardNavbar
            navItems={dashboards ? dashboards.map((dashboard) => dashboard) : []}
            value={selectedDashboard}
            setNavTab={setSelectedDashboard}
          />
        </Box>
        <Box className={classes.viewContainer}>{children}</Box>
      </ProjectLayoutProvider>
    </Box>
  );
}

ProjectLayout.propTypes = {
  children: ChildrenPropTypes.isRequired,
};

export default ProjectLayout;
