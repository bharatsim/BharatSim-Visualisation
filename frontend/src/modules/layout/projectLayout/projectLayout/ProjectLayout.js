import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box } from '@material-ui/core';
import DashboardNavbar from '../sideDashboardNavbar/DashboardNavbar';

import useProjectLayoutStyle from './projectLayoutCSS';
import useFetch from '../../../../hook/useFetch';

import { api } from '../../../../utils/api';
import { ProjectLayoutProvider } from '../../../../contexts/projectLayoutContext';
import { ChildrenPropTypes } from '../../../../commanPropTypes';
import useDeepCompareMemoize from '../../../../hook/useDeepCompareMemoize';

function ProjectLayout({ children }) {
  const classes = useProjectLayoutStyle();
  const { id: projectId } = useParams();
  const history = useHistory();

  const [projectMetadata, setProjectMetadata] = useState({
    id: null,
    name: 'untitled project',
  });

  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  const { data: fetchedProjectMetadata } = useFetch(api.getProject, [projectId], !!projectId);

  useEffect(() => {
    if (fetchedProjectMetadata) {
      const { _id, name } = fetchedProjectMetadata.project;
      setProjectMetadata({ id: _id, name });
    }
  }, useDeepCompareMemoize([fetchedProjectMetadata]));

  const { data: fetchedDashboards } = useFetch(
    api.getAllDashBoardByProjectId,
    [projectId],
    !!projectId,
  );
  useEffect(() => {
    if (projectId) {
      history.push(`/projects/${projectId}/configure-dataset`);
    }
  }, [selectedDashboard]);

  useEffect(() => {
    if (fetchedDashboards) setDashboards(fetchedDashboards.dashboards);
  }, useDeepCompareMemoize([fetchedDashboards]));

  useEffect(() => {
    if (fetchedDashboards && fetchedDashboards.dashboards.length === 0) {
      history.replace({ pathname: `/projects/${projectId}/create-dashboard` });
    }
  }, useDeepCompareMemoize([fetchedDashboards, projectId]));

  function addDashboard(dashboard) {
    setDashboards([...dashboards, dashboard]);
  }

  return (
    <Box className={classes.layoutContainer}>
      <ProjectLayoutProvider
        value={{
          projectMetadata,
          selectedDashboardMetadata: dashboards[selectedDashboard] || {},
          addDashboard,
        }}
      >
        <Box className={classes.sideBarLayout}>
          <DashboardNavbar
            navItems={dashboards.map((dashboard) => dashboard)}
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
