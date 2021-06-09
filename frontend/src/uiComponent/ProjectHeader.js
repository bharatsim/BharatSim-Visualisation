import React, { useContext } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { projectLayoutContext } from '../contexts/projectLayoutContext';

const useProjectLayoutStyle = makeStyles((theme) => ({
  projectNameBar: {
    textTransform: 'capitalize',
    boxShadow: '0px 1px 1px rgba(78, 96, 176, 0.3)',
    height: theme.spacing(12),
    padding: theme.spacing(0, 8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonRoot: {
    padding: 0,
  },
}));

function ProjectHeader() {
  const classes = useProjectLayoutStyle();
  const history = useHistory();
  const { projectMetadata } = useContext(projectLayoutContext);
  const { name } = projectMetadata;

  function openRecentProjects() {
    history.push('/');
  }

  return (
    <Box className={classes.projectNameBar}>
      <Typography variant="h5">{name}</Typography>
      <Button
        onClick={openRecentProjects}
        variant="text"
        size="small"
        classes={{ root: classes.buttonRoot }}
      >
        Back to recent projects
      </Button>
    </Box>
  );
}

export default ProjectHeader;
