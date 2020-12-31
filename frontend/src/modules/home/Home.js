import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExistingUserHomeScreen from './ExistingUserHomeScreen';
import { api } from '../../utils/api';
import NewUserHomeScreen from './NewUserHomeScreen';

const styles = makeStyles(() => ({
  mainContainer: {
    width: '100%',
    margin: 'auto',
    marginTop: 0,
  },
}));

function Home() {
  const classes = styles();
  const [recentProjects, setRecentProjects] = useState();

  async function fetchRecentProjects() {
    const fetchedProjects = await api.getProjects();
    setRecentProjects(fetchedProjects.projects);
  }
  useEffect(() => {
    fetchRecentProjects();
  }, []);

  if (!recentProjects) {
    return null;
  }
  return (
    <Box px={32} pt={16} className={classes.mainContainer}>
      {recentProjects && recentProjects.length > 0 ? (
        <ExistingUserHomeScreen
          recentProjects={recentProjects}
          setRecentProjects={setRecentProjects}
        />
      ) : (
        <NewUserHomeScreen />
      )}
    </Box>
  );
}

export default Home;
