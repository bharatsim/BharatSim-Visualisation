import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardLayout from './component/dashboardLayout/DashboardLayout';
import Home from './modules/home/Home';
import ConfigureDashboardData from './modules/configureDataset/ConfigureDashboardData';
import UploadDataset from './modules/uplaodDataset/UploadDataset';

function AppRoute() {
  return (
    <>
      <Switch>
        <Route path="/old-dashboard">
          <DashboardLayout />
        </Route>
        <Route path="/projects/create">
          <ConfigureDashboardData />
        </Route>
        <Route path="/projects/:id/upload-dataset">
          <UploadDataset />
        </Route>
        <Route path="/projects/:id">
          <ConfigureDashboardData />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default AppRoute;
