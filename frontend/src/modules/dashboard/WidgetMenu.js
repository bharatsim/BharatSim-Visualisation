import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@material-ui/core';
import { DeleteOutline, MoreVert, EditOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import useModal from '../../hook/useModal';
import DropdownMenu from '../../uiComponent/dropdownMenu/DropdownMenu';
import IconButton from '../../uiComponent/IconButton';

const iconStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
}));
export default function WidgetMenu({ onDelete, onEdit }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const iconClasses = iconStyles();
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

  function onMenuClick(handler) {
    return () => {
      closeMenu();
      handler();
    };
  }

  function handleDelete() {
    closeDeleteModal();
    onDelete();
  }

  return (
    <>
      <IconButton data-testid="widget-menu" disableRipple onClick={openMenu} classes={iconClasses}>
        <MoreVert htmlColor={theme.colors.grayScale['500']} />
      </IconButton>
      <DropdownMenu
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        menuItems={[
          {
            label: 'Configure Chart',
            dataTestId: 'EditChart',
            onClick: onMenuClick(onEdit),
            icon: <EditOutlined />,
          },
          {
            label: 'Delete Chart',
            dataTestId: 'DeleteChart',
            onClick: onMenuClick(openDeleteModal),
            icon: <DeleteOutline />,
            withDivider: true,
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
