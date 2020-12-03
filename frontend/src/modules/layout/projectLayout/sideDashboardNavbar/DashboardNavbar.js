import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import dashboardIcon from '../../../../assets/images/dashboard-icon.svg';
import { useTabsStyles, useTabStyles } from './sideDashboardNavbarCSS';
import CreateNewDashboardModal from '../../../projectHomeScreen/CreateNewDashboardModal';
import useModal from '../../../../hook/useModal';
import { projectLayoutContext } from '../../../../contexts/projectLayoutContext';
import plusIcon from '../../../../assets/images/addDashboard.svg';

function DashboardNavbar({ navItems, value, setNavTab }) {
  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();
  const { projectMetadata } = useContext(projectLayoutContext);
  const { openModal, isOpen, closeModal } = useModal();

  function handleTabChange(event, selectedTabId) {
    setNavTab(selectedTabId);
  }

  return (
    <Box px={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" pl={7}>
        <Typography variant="subtitle2">Dashboards </Typography>
        <IconButton onClick={openModal} data-testid="add-dashboard-button">
          <img src={plusIcon} alt="icon" />
        </IconButton>
      </Box>

      <Tabs
        orientation="vertical"
        variant="fullWidth"
        value={value}
        classes={tabsClasses}
        onChange={handleTabChange}
      >
        {navItems.map(({ name: dashboardName, _id: dashboardId }) => (
          <Tab
            icon={(
              <Box pr={3} display="flex" alignItems="center">
                <img src={dashboardIcon} alt="dashboard-logo" />
              </Box>
            )}
            label={dashboardName}
            key={`tab-${dashboardId}`}
            classes={tabClasses}
            data-testid={`tab-${dashboardId}`}
          />
        ))}
      </Tabs>
      {isOpen && (
        <CreateNewDashboardModal
          isOpen={isOpen}
          closeModal={closeModal}
          onlyDashboardField={!!projectMetadata.id}
        />
      )}
    </Box>
  );
}

DashboardNavbar.propTypes = {
  navItems: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string }))
    .isRequired,
  value: PropTypes.number.isRequired,
  setNavTab: PropTypes.func.isRequired,
};

export default DashboardNavbar;
