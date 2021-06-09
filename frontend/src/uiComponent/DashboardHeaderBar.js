import React from 'react';
import { Box, fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChildrenPropTypes } from '../commanPropTypes';

const useStyle = makeStyles((theme) => ({
  dashboardHeaderBar: {
    width: '100%',
    display: 'flex',
    height: theme.spacing(12),
    backgroundColor: fade(theme.colors.grayScale['100'], 0.5),
    alignItems: 'center',
  },
}));

function DashboardHeaderBar({ children }) {
  const classes = useStyle();

  return <Box className={classes.dashboardHeaderBar}>{children}</Box>;
}

DashboardHeaderBar.propTypes = {
  children: ChildrenPropTypes,
};

DashboardHeaderBar.defaultProps = {
  children: null,
};

export default DashboardHeaderBar;
