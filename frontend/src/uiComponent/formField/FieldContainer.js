import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Box, Typography } from '@material-ui/core';
import { ChildrenPropTypes } from '../../commanPropTypes';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    padding: theme.spacing(0, 2),
    flexDirection: 'column',
  },
  mainContainerInline: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  fieldContainer: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(4),
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },
  fieldContainerInline: {
    marginLeft: theme.spacing(2),
    alignItems: 'center',
  },
}));

function FieldContainer({ title, children, inline }) {
  const classes = useStyles({ inline });
  return (
    <Box className={clsx([classes.mainContainer, inline && classes.mainContainerInline])}>
      {title && (
        <Box mb={inline ? 0 : 1}>
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
      )}
      <Box className={clsx([classes.fieldContainer, inline && classes.fieldContainerInline])}>
        {children}
      </Box>
    </Box>
  );
}

FieldContainer.defaultProps = {
  title: '',
  inline: false,
  children: null,
};

FieldContainer.propTypes = {
  title: PropTypes.string,
  children: ChildrenPropTypes,
  inline: PropTypes.bool,
};

export default FieldContainer;
