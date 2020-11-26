import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { ChildrenPropTypes } from '../../commanPropTypes';

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    height: `calc(100% - ${theme.spacing(8) + theme.spacing(2)}px)`,
    width: '100%',
  },
  mainContainer: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  chartName: {
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  widgetTitle: {
    height: theme.spacing(8),
    padding: theme.spacing(1, 6),
    boxShadow: 'inset 0px -1px 1px rgba(105, 78, 214, 0.25)',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
}));

function Widget({ title, children }) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.widgetTitle}>
        <Typography classes={{ body2: classes.chartName }} variant="body2">
          {title}
        </Typography>
      </Box>
      <Box className={classes.chartContainer}>{children}</Box>
    </>
  );
}

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  children: ChildrenPropTypes.isRequired,
};
export default Widget;
