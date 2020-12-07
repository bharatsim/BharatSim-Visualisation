import Box from '@material-ui/core/Box';
import React, { forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import dashboardIcon from '../../../../assets/images/dashboard-icon.svg';
import optionsIcon from '../../../../assets/images/optionsIcon.svg';
import deleteIcon from '../../../../assets/images/delete.svg';
import { useTabStyles } from './sideDashboardNavbarCSS';
import { ChildrenPropTypes } from '../../../../commanPropTypes';
import useMenuStyles from './navBarCss';
import DeleteConfirmationModal from '../../../../uiComponent/DeleteConfirmationModal';
import useModal from '../../../../hook/useModal';

const NavBarTab = forwardRef(function NavBarTab(
  { onClick, dashboard, dataTestId, tabIndex, children, deleteDashboard },
  ref,
) {
  const classes = useTabStyles();
  const menuClasses = useMenuStyles();
  const isSelected = !tabIndex;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  function onOpenDeleteModal() {
    closeMenu();
    openDeleteModal();
  }

  function handleDelete() {
    closeDeleteModal();
    deleteDashboard(dashboard);
  }

  return (
    <>
      <Box
        onClick={onClick}
        data-testid={dataTestId}
        className={`${classes.root} ${isSelected ? classes.selected : ''}`}
        ref={ref}
      >
        <Box className={classes.iconLabelWrapper}>
          <Box className={classes.icon} mr={3}>
            <img src={dashboardIcon} alt="dashboard-logo" />
          </Box>
          {dashboard.dashboardName}
        </Box>
        <Box className={`${classes.optionIcon}`}>
          {isSelected && (
            <IconButton onClick={openMenu}>
              <img src={optionsIcon} alt="options-logo" />
            </IconButton>
          )}
        </Box>

        {isSelected && (
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
            <MenuItem
              onClick={onOpenDeleteModal}
              classes={{ root: menuClasses.root }}
              data-testid={`delete-option-${dashboard.dashboardId}`}
            >
              <Box className={menuClasses.menuOption}>
                <img src={deleteIcon} alt="delete-logo" />
                <Box ml={4}>
                  <Typography variant="body2">Delete Dashboard</Typography>
                </Box>
              </Box>
            </MenuItem>
          </Menu>
        )}
        <Box display="none">{children}</Box>
      </Box>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          handleClose={closeDeleteModal}
          open={isDeleteModalOpen}
          title="Delete Dashboard"
          deleteAction={{
            onDelete: handleDelete,
            name: 'Delete Dashboard',
            dataTestId: 'delete-dashboard-button',
          }}
        >
          <Typography variant="body2">
            Are you sure you want to delete this dashboard and all it’s configurations? This action
            can’t be undone
          </Typography>
        </DeleteConfirmationModal>
      )}
    </>
  );
});

NavBarTab.defaultProps = {
  children: '',
};
NavBarTab.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: ChildrenPropTypes,
  dataTestId: PropTypes.string.isRequired,
  dashboard: PropTypes.shape({ dashboardName: PropTypes.string, dashboardId: PropTypes.string })
    .isRequired,
  tabIndex: PropTypes.number.isRequired,
  deleteDashboard: PropTypes.func.isRequired,
};

export default NavBarTab;
