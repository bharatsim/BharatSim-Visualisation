import { NavigateNext } from '@material-ui/icons';
import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Button, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const TextButton = withStyles((theme) => ({
  text: {
    boxShadow: 'unset',
    padding: 0,
    height: theme.spacing(4),
    minWidth: theme.spacing(16),
    lineHeight: '1',
    fontSize: '0.875rem',
    '&:focus': {
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}))(Button);

const ListTypography = withStyles((theme) => ({
  subtitle2: {
    padding: 0,
    lineHeight: '1',
    color: theme.palette.text.primary,
  },
}))(Typography);

function DrillDownNavBreadcrumbs({ items }) {
  const lastItem = items.pop();
  return (
    <MuiBreadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      style={{ zIndex: 23 }}
    >
      {items.map(({ label, onClick }) => (
        <TextButton variant="text" onClick={onClick} size="small" disableRipple key={label}>
          {label}
        </TextButton>
      ))}
      <ListTypography variant="subtitle2">{lastItem.label}</ListTypography>
    </MuiBreadcrumbs>
  );
}

DrillDownNavBreadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ).isRequired,
};

export default DrillDownNavBreadcrumbs;
