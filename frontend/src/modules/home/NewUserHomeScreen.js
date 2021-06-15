import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import bharatSimWelcome from '../../assets/images/welcomePlaceholder.svg';
import ButtonGroup from '../../uiComponent/ButtonGroup';

const styles = makeStyles((theme) => ({
  mainContainer: {
    margin: 'auto',
    paddingTop: theme.spacing(25),
  },
  textCentered: {
    textAlign: 'center',
  },
  introTextContainer: {
    margin: 'auto',
    marginTop: theme.spacing(4),
    width: theme.spacing(144),
  },
  itemsCentered: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function NewUserHomeScreen() {
  const classes = styles();
  const history = useHistory();

  function createNewProject() {
    history.push('/projects/create');
  }

  return (
    <Box className={classes.mainContainer}>
      <Box mb={8} className={classes.itemsCentered}>
        <img src={bharatSimWelcome} alt="logo" height={148} width={148} />
      </Box>
      <Typography variant="h4" className={classes.textCentered}>
        Welcome to BharatSim
      </Typography>
      <Box className={classes.introTextContainer}>
        <Typography variant="body2" className={classes.textCentered}>
          BharatSim Visualization engine would accept Simulation engine output or any csv data file
          and would help users to visualize it by means of creating different graphs and charts.
        </Typography>
      </Box>
      <Box mt={5} className={classes.itemsCentered}>
        <ButtonGroup>
          <Button variant="contained" color="primary" size="large" onClick={createNewProject}>
            Create new Project
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

export default NewUserHomeScreen;
