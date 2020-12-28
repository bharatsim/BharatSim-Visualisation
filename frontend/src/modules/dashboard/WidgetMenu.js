import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography } from '@material-ui/core';
import { DeleteOutline, MoreVert } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import useMenuStyles from '../layout/projectLayout/sideDashboardNavbar/navBarCss';
import useModal from '../../hook/useModal';

export default function WidgetMenu({ onDelete }) {
  const menuClasses = useMenuStyles();
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
    onDelete();
  }

  return (
    <>
      <IconButton data-testid="widget-menu" disableRipple onClick={openMenu}>
        <MoreVert />
      </IconButton>
      <Menu
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
        <MenuItem onClick={onOpenDeleteModal}>
          <ListItemIcon className={menuClasses.listItemIcon}>
            <DeleteOutline />
          </ListItemIcon>
          <Typography variant="body2">Delete Chart</Typography>
        </MenuItem>
      </Menu>

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          handleClose={closeDeleteModal}
          open={isDeleteModalOpen}
          title="Delete Chart"
          deleteAction={{
            onDelete: handleDelete,
            name: 'Delete Chart',
            dataTestId: 'delete-chart-confirm',
          }}
        >
          <Typography variant="body2">
            Are you sure you want to delete this chart and all it’s configurations? This action
            can’t be undone
          </Typography>
        </DeleteConfirmationModal>
      )}
    </>
  );
}

WidgetMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
