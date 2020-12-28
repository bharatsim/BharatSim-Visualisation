import Box from '@material-ui/core/Box';
import React, { forwardRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import dashboardIcon from '../../../../assets/images/dashboard-icon.svg';
import optionsIcon from '../../../../assets/images/optionsIcon.svg';
import deleteIcon from '../../../../assets/images/delete.svg';
import { useTabStyles } from './sideDashboardNavbarCSS';
import { ChildrenPropTypes } from '../../../../commanPropTypes';
import DeleteConfirmationModal from '../../../../uiComponent/DeleteConfirmationModal';
import useModal from '../../../../hook/useModal';
import RadioLabel from '../../../../uiComponent/RadioLabel';
import DropdownMenu from '../../../../uiComponent/DropdownMenu/DropdownMenu';

const useRadioStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    marginLeft: theme.spacing(3),
  },
}));

const RadioOptions = {
  Yes: true,
  No: false,
};
const NavBarTab = forwardRef(function NavBarTab(
  { onClick, dashboard, dataTestId, tabIndex, children, deleteDashboard },
  ref,
) {
  const classes = useTabStyles();
  const radioClasses = useRadioStyle();
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
          <Box pb={4}>
            <Box pb={4}>
              <Typography variant="body1">
                You want to delete this dashboard and all it’s configurations? This action can’t be
                undone.
              </Typography>
            </Box>
            <Typography variant="body1">
              However, you can decide what you want to do with the dataset that is linked to this
              dashboard alone.
            </Typography>
          </Box>

          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={shouldDeleteDatasources}
              onChange={handleRadioButtonChange}
            >
              <Box mb={3}>
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  classes={radioClasses}
                  data-testid="yes-radio-button"
                  label={(
                    <RadioLabel
                      header="Yes, delete all the dataset associated with this Dashboard"
                      description="Any dataset that is not linked to another project
                    or dashboard will be permanently deleted from the dataset library."
                    />
                  )}
                />
              </Box>
              <FormControlLabel
                value="No"
                control={<Radio />}
                classes={radioClasses}
                data-testid="no-radio-button"
                label={(
                  <RadioLabel
                    header="No, keep the dataset in the dataset library"
                    description="The dataset will be unlinked from the dashboard and the project and
                    will be available in the dataset library."
                  />
                )}
              />
            </RadioGroup>
          </FormControl>
          <Box />
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
