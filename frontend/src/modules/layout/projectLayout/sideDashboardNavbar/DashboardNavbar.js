import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useTabsStyles } from './sideDashboardNavbarCSS';
import CreateNewDashboardModal from '../../../projectHomeScreen/CreateNewDashboardModal';
import useModal from '../../../../hook/useModal';
import { projectLayoutContext } from '../../../../contexts/projectLayoutContext';
import plusIcon from '../../../../assets/images/addDashboard.svg';
import { api } from '../../../../utils/api';
import NavBarTab from './NavBarTab';
import snackbarVariant from '../../../../constants/snackbarVariant';
import { overlayLoaderOrErrorContext } from '../../../../contexts/overlayLoaderOrErrorContext';
import { errors, errorTypes } from '../../../../constants/loaderAndErrorMessages';

function DashboardNavbar({ navItems, value, setNavTab }) {
  const { enqueueSnackbar } = useSnackbar();
  const tabsClasses = useTabsStyles();
  const { projectMetadata, deleteDashboard } = useContext(projectLayoutContext);
  const { openModal, isOpen, closeModal } = useModal();

  function handleTabChange(event, selectedTabId) {
    setNavTab(selectedTabId);
  }

  const { showError } = useContext(overlayLoaderOrErrorContext);

  async function deleteDataSourceForDashboard(datasources, dashboardName) {
    const datasourceIds = datasources.map(({ _id: datasourceId }) => datasourceId);
    return api
      .deleteDatasource(datasourceIds)
      .then(() => {
        enqueueSnackbar(`Datasource files for Dashboard ${dashboardName} Deleted successfully`, {
          variant: snackbarVariant.SUCCESS,
        });
      })
      .catch(() => {
        showError(errors[errorTypes.DASHBOARD_DATASOURCE_DELETE_FAILED](dashboardName));
      });
  }

  async function deleteDashboardForDashboardId(dashboardId, dashboardName) {
    return api
      .deleteDashboard(dashboardId)
      .then(() => {
        setNavTab(0);
        deleteDashboard(dashboardId);
        enqueueSnackbar(`Dashboard ${dashboardName} Deleted successfully`, {
          variant: snackbarVariant.SUCCESS,
        });
      })
      .catch(() => {
        showError(errors[errorTypes.DASHBOARD_DELETE_FAILED](dashboardName));
      });
  }

  async function handleDeleteDashboard(dashboard, shouldDeleteDatasources) {
    const { dashboardName, dashboardId } = dashboard;
    const { dataSources } = await api.getDatasources(dashboardId, false, false);
    await deleteDashboardForDashboardId(dashboardId, dashboardName);
    if (shouldDeleteDatasources && dataSources.length > 0) {
      await deleteDataSourceForDashboard(dataSources, dashboardName);
    }
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
            dashboard={{ dashboardName, dashboardId }}
            component={NavBarTab}
            dataTestId={`tab-${dashboardId}`}
            key={`tab-${dashboardId}`}
            deleteDashboard={handleDeleteDashboard}
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
