import Box from '@material-ui/core/Box';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import Divider from "@material-ui/core/Divider";
import useMenuStyles from './dropdownMenuCss';

function DropdownMenu({ anchorEl, closeMenu, menuItems }) {
  const menuClasses = useMenuStyles();
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeMenu}
      classes={{ paper: menuClasses.menuPaper }}
      PopoverClasses={{
        paper: menuClasses.popoverPaper,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      getContentAnchorEl={null}
    >
      {menuItems.map(({ icon, label, onClick, dataTestId, withDivider = false }) => {
        return (
          <>
            { withDivider && <Divider />}
            <MenuItem
              onClick={onClick}
              classes={{ root: menuClasses.root }}
              data-testid={dataTestId}
              key={dataTestId}
            >
              <Box className={menuClasses.menuOption}>
                {icon}
                <Box ml={4}>
                  <Typography variant="body2">{label}</Typography>
                </Box>
              </Box>
            </MenuItem>
          </>
        );
      })}
    </Menu>
  );
}

DropdownMenu.defaultProps = {
  anchorEl: null,
};

DropdownMenu.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.shape({})]),
  closeMenu: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      dataTestId: PropTypes.string.isRequired,
      withDivider: PropTypes.bool,
    }),
  ).isRequired,
};

export default DropdownMenu;
