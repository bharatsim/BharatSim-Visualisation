import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './modules/home/Home';
import ConfigureDataset from './modules/configureDataset/ConfigureDataset';
import UploadDataset from './modules/uploadDataset/UploadDataset';
import ProjectLayout from './modules/layout/projectLayout/projectLayout/ProjectLayout';
import ProjectHomeScreen from './modules/projectHomeScreen/ProjectHomeScreen';
import Dashboard from './modules/dashboard/Dashboard';

function renderProjectRoute() {
  return (
    <ProjectLayout>
      <Switch>
        <Route exact path="/projects/:id/create-dashboard">
          <ProjectHomeScreen />
        </Route>
        <Route exact path="/projects/:id/upload-dataset">
          <UploadDataset />
        </Route>
        <Route exact path="/projects/:id/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/projects/:id/configure-dataset">
          <ConfigureDataset />
        </Route>
      </Switch>
    </ProjectLayout>
  );
}

function AppRoute() {
  return (
    <>
      <Switch>
        <Route path="/projects/create">
          <ProjectLayout>
            <ProjectHomeScreen />
          </ProjectLayout>
        </Route>
        <Route path="/projects/:id">{renderProjectRoute()}</Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default AppRoute;
