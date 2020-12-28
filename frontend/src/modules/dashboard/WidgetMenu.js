import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography } from '@material-ui/core';
import { DeleteOutline, MoreVert } from '@material-ui/icons';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import useModal from '../../hook/useModal';
import DropdownMenu from '../../uiComponent/DropdownMenu/DropdownMenu';

export default function WidgetMenu({ onDelete }) {
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
      <DropdownMenu
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        menuItems={[
          {
            label: 'Delete Chart',
            dataTestId: 'DeleteChart',
            onClick: onOpenDeleteModal,
            icon: <DeleteOutline />,
          },
        ]}
      />
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
