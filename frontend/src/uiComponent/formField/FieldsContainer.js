import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChildrenPropTypes } from '../../commanPropTypes';

const FieldsOrientations = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const useStyles = makeStyles((theme) => ({
  fieldsContainerVertical: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(4),
    },
    '& > *:last-child': {
      marginBottom: 0,
    },
  },
  fieldsContainerHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      marginRight: theme.spacing(4),
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },
  textContainer: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

function FieldsContainer({ title, children, orientation }) {
  const classes = useStyles();
  return (
    <Box className={clsx([classes.mainContainer])}>
      {title && (
        <Box className={classes.textContainer}>
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
      )}
      <Box
        className={
          orientation === FieldsOrientations.VERTICAL
            ? classes.fieldsContainerVertical
            : classes.fieldsContainerHorizontal
        }
      >
        {children}
      </Box>
    </Box>
  );
}

FieldsContainer.defaultProps = {
  orientation: FieldsOrientations.VERTICAL,
  title: '',
};

FieldsContainer.propTypes = {
  title: PropTypes.string,
  children: ChildrenPropTypes.isRequired,
  orientation: PropTypes.oneOf([...Object.values(FieldsOrientations)]),
};

export default FieldsContainer;
