import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { ChildrenPropTypes } from '../commanPropTypes';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    '& > *': {
      marginLeft: theme.spacing(1),
    },
    '& > :first-child': {
      marginLeft: theme.spacing(0),
    },
  },
}));

function ButtonGroup({ children }) {
  const classes = useStyles();
  return <Box className={classes.buttonGroup}>{children}</Box>;
}

ButtonGroup.propTypes = {
  children: ChildrenPropTypes.isRequired,
};

export default ButtonGroup;
