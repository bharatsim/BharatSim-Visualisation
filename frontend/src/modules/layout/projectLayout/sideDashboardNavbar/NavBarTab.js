import Box from '@material-ui/core/Box';
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import dashboardIcon from '../../../../assets/images/dashboard-icon.svg';
import optionsIcon from '../../../../assets/images/optionsIcon.svg';
import deleteIcon from '../../../../assets/images/delete.svg';
import { useTabStyles } from './sideDashboardNavbarCSS';
import { ChildrenPropTypes } from '../../../../commanPropTypes';
import useModal from '../../../../hook/useModal';
import DropdownMenu from '../../../../uiComponent/DropdownMenu/DropdownMenu';
import DashboardDeleteConfirmationModal from './DashboardDeleteConfirmationModal';
import IconButton from '../../../../uiComponent/IconButton';

const RadioOptions = {
  Yes: true,
  No: false,
};
const NavBarTab = forwardRef(function NavBarTab(
  { onClick, dashboard, dataTestId, tabIndex, children, deleteDashboard },
  ref,
) {
  const classes = useTabStyles();
  const isSelected = !tabIndex;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [shouldDeleteDatasources, setShouldDeleteDatasources] = useState('Yes');

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  function onOpenDeleteModal() {
    closeMenu();
    setShouldDeleteDatasources('Yes');
    openDeleteModal();
  }

  function handleDelete() {
    closeDeleteModal();
    deleteDashboard(dashboard, RadioOptions[shouldDeleteDatasources]);
  }

  function handleRadioButtonChange(event) {
    setShouldDeleteDatasources(event.target.value);
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
          <DropdownMenu
            anchorEl={anchorEl}
            closeMenu={closeMenu}
            menuItems={[
              {
                label: 'Delete Dashboard',
                icon: <img src={deleteIcon} alt="delete-logo" />,
                onClick: onOpenDeleteModal,
                dataTestId: `delete-option-${dashboard.dashboardId}`,
              },
            ]}
          />
        )}
        <Box display="none">{children}</Box>
      </Box>
      {isDeleteModalOpen && (
        <DashboardDeleteConfirmationModal
          closeDeleteModal={closeDeleteModal}
          handleDelete={handleDelete}
          handleRadioButtonChange={handleRadioButtonChange}
          isDeleteModalOpen={isDeleteModalOpen}
          shouldDeleteDatasources={shouldDeleteDatasources}
        />
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
