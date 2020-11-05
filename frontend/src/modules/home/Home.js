import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExistingUserHomeScreen from './ExistingUserHomeScreen';
import useFetch from '../../hook/useFetch';
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
  const { data: recentProjects } = useFetch(api.getProjects);
  const classes = styles();
  if (!recentProjects) {
    return null;
  }
  return (
    <Box px={32} pt={16} className={classes.mainContainer}>
      {recentProjects && recentProjects.projects.length > 0 ? (
        <ExistingUserHomeScreen recentProjects={recentProjects.projects} />
      ) : (
        <NewUserHomeScreen />
      )}
    </Box>
  );
}

export default Home;
