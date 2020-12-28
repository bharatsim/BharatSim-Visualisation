import React from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const subtitleStyles = makeStyles((theme) => ({
  body2: {
    color: theme.colors.grayScale['400'],
  },
}));

function RadioLabel({ header, description }) {
  const subtitleClasses = subtitleStyles();
  return (
    <Box>
      <Typography variant="subtitle2">{header}</Typography>
      <Typography variant="body2" classes={subtitleClasses}>
        {description}
      </Typography>
    </Box>
  );
}

RadioLabel.defaultProps = {
  description: '',
};
RadioLabel.propTypes = {
  header: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default RadioLabel;
