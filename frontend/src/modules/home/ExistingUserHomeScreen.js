import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import ProjectMetadataCard from './ProjectMetadataCard';
import theme from '../../theme/theme';
import TabPanel from '../../uiComponent/TabPanel';
import ButtonGroup from '../../uiComponent/ButtonGroup';
import Datasets from './Datasets';

const styles = makeStyles(() => ({
  projectListContainer: {
    marginTop: theme.spacing(11),
  },
}));

function ExistingUserHomeScreen({ recentProjects, setRecentProjects }) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const history = useHistory();
  const classes = styles();

  function deleteProject(selectedProjectId) {
    const updatedProjects = recentProjects.filter(({ _id: projectId }) => {
      return projectId !== selectedProjectId;
    });
    setRecentProjects(updatedProjects);
  }

  function openProject(id) {
    history.push(`/projects/${id}/configure-dataset`);
  }

  function createNewProject() {
    history.push('/projects/create');
  }

  function onTabChange(e, value) {
    setSelectedTab(value);
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          aria-label="disabled tabs example"
          onChange={onTabChange}
        >
          <Tab label="Recent Projects" value={0} />
          <Tab label="Datasets" value={1} />
        </Tabs>

        <ButtonGroup>
          <Button variant="contained" color="primary" size="small" onClick={createNewProject}>
            Add New
          </Button>
        </ButtonGroup>
      </Box>

      <Box className={classes.projectListContainer}>
        <TabPanel value={selectedTab} index={0}>
          {recentProjects && (
            <Grid container spacing={8} xl={12}>
              {recentProjects.map((project) => {
                const { _id } = project;
                return (
                  <Grid item xs={3} key={_id}>
                    <ProjectMetadataCard
                      project={project}
                      onProjectClick={openProject}
                      deleteProject={deleteProject}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Datasets />
        </TabPanel>
      </Box>
    </Box>
  );
}

ExistingUserHomeScreen.propTypes = {
  setRecentProjects: PropTypes.func.isRequired,
  recentProjects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      _id: PropTypes.string,
    }),
  ).isRequired,
};

export default ExistingUserHomeScreen;
