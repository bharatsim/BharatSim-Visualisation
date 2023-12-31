import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography, useTheme } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import { ChildrenPropTypes } from '../../commanPropTypes';
import dragIcon from '../../assets/images/dragIcon.svg';
import WidgetMenu from './WidgetMenu';
import IconButton from '../../uiComponent/IconButton';
import ExportChartMenu from './ExportChartMenu';

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
  icon: {
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
  menubar: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },
}));

function Widget({ title, onDelete, onEdit, children, onDuplicate }) {
  const classes = useStyles();
  const ref = useRef();
  const theme = useTheme();

  return (
    <>
      <Box className={`dragHandler ${classes.dragIconContainer}`}>
        <img src={dragIcon} alt="drag" />
      </Box>
      <Box className={classes.widgetTitle}>
        <Typography classes={{ body2: classes.chartName }} variant="body2">
          {title}
        </Typography>
        <Box className={classes.menubar}>
          <IconButton
            onClick={onDuplicate}
            title="Duplicate chart"
            data-testid="duplicate-button"
            classes={{ root: classes.icon }}
          >
            <FileCopyOutlined fontSize="small" htmlColor={theme.colors.grayScale['500']} />
          </IconButton>
          <ExportChartMenu element={ref.current} title={title} />
          <WidgetMenu onEdit={onEdit} onDelete={onDelete} />
        </Box>
      </Box>
      <Box className={classes.chartContainer} ref={ref}>
        {children}
      </Box>
    </>
  );
}

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  children: ChildrenPropTypes.isRequired,
};
export default Widget;
