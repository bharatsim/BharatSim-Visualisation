import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { ChildrenPropTypes } from '../../commanPropTypes';
import dragIcon from '../../assets/images/dragIcon.svg';
import WidgetMenu from './WidgetMenu';

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
    padding: theme.spacing(0, 6, 2, 6),
    'padding-right': theme.spacing(1),
    boxShadow: 'inset 0px -1px 1px rgba(105, 78, 214, 0.25)',
    'justify-content': 'space-between',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  dragIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    cursor: 'grab',
  },
}));

function Widget({ title, onDelete, children }) {
  const classes = useStyles();

  return (
    <>
      <Box className={`dragHandler ${classes.dragIconContainer}`}>
        <img src={dragIcon} alt="drag" />
      </Box>
      <Box className={classes.widgetTitle}>
        <Typography classes={{ body2: classes.chartName }} variant="body2">
          {title}
        </Typography>
        <WidgetMenu onDelete={onDelete} />
      </Box>
      <Box className={classes.chartContainer}>{children}</Box>
    </>
  );
}

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  children: ChildrenPropTypes.isRequired,
};
export default Widget;
