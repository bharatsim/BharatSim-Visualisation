const DashboardModel = require('../model/dashboard');

async function insert(dashboardConfigs) {
  const dashboardModel = new DashboardModel(dashboardConfigs);
  return dashboardModel.save();
}

async function update(dashboardId, dashboardConfigs) {
  return DashboardModel.updateOne({ _id: dashboardId }, dashboardConfigs);
}

async function getAll(filter, projectedColumns) {
  return DashboardModel.find(filter, projectedColumns);
}

async function getOne(dashboardId) {
  return DashboardModel.findOne({ _id: dashboardId }, { __v: 0 });
}

async function deleteOne(dashboardId) {
  return DashboardModel.deleteOne({ _id: dashboardId }, { __v: 0 });
}

module.exports = {
  insert,
  update,
  getAll,
  getOne,
  deleteOne,
};
