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
  },
  textCentered: {
    textAlign: 'center',
  },
  introTextContainer: {
    margin: 'auto',
    marginTop: theme.spacing(9),
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
      <Typography variant="h4" className={classes.textCentered}>
        Welcome to BharatSim
      </Typography>
      <Box mt={14} className={classes.itemsCentered}>
        <img src={bharatSimWelcome} alt="logo" />
      </Box>
      <Box className={classes.introTextContainer}>
        <Typography variant="subtitle2" className={classes.textCentered}>
          Intro text
        </Typography>
        <Typography variant="body2" className={classes.textCentered}>
          Bharat Sim Visualisation description text
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
