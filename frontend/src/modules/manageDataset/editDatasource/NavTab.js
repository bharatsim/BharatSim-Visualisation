import React, { forwardRef } from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DeleteOutlined } from '@material-ui/icons';
import { useTheme } from '@material-ui/core';

import { ChildrenPropTypes } from '../../../commanPropTypes';
import { useTabStyles } from '../../layout/projectLayout/sideDashboardNavbar/sideDashboardNavbarCSS';
import IconButton from '../../../uiComponent/IconButton';

const useLabelStyle = makeStyles((theme) => ({
  label: ({ isSelected }) => ({
    color: isSelected ? theme.colors.textLight.primary : theme.palette.text.primary,
  }),
}));

const NavBarTab = forwardRef(function NavBarTab(
  { onClick, name, dataTestId, tabIndex, onDelete, children },
  ref,
) {
  const classes = useTabStyles();
  const isSelected = !tabIndex;
  const labelClasses = useLabelStyle({ isSelected });
  const theme = useTheme();

  function handleDelete(event) {
    event.stopPropagation();
    onDelete();
  }

  return (
    <Box
      onClick={onClick}
      data-testid={dataTestId}
      className={`${classes.root} ${isSelected ? classes.selected : ''}`}
      ref={ref}
    >
      <Box className={clsx([classes.iconLabelWrapper, labelClasses.label])}>{name}</Box>
      <Box pr={2}>
        {isSelected && (
          <IconButton onClick={handleDelete} data-testid={`delete-${dataTestId}`}>
            <DeleteOutlined fontSize="small" htmlColor={theme.palette.background.paper} />
          </IconButton>
        )}
      </Box>
      <Box display="none">{children}</Box>
    </Box>
  );
});

NavBarTab.defaultProps = {
  children: '',
};
NavBarTab.propTypes = {
  dataTestId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  children: ChildrenPropTypes,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NavBarTab;
