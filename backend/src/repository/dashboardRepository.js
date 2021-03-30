const mongoose = require('mongoose');
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

async function getCount(filter) {
  return DashboardModel.countDocuments(filter);
}

async function deleteOne(dashboardId) {
  return DashboardModel.deleteOne({ _id: dashboardId }, { __v: 0 });
}

async function getChartCountForDatasource(datasourceId, dashboardId) {
  const counts = await DashboardModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(dashboardId) } },
    { $unwind: { path: '$charts' } },
    { $unwind: { path: '$charts.dataSourceIds' } },
    { $group: { _id: '$charts.dataSourceIds', count: { $sum: 1 } } },
    { $match: { _id: datasourceId } },
  ]);
  return counts[0] || { count: 0 };
}

module.exports = {
  insert,
  update,
  getAll,
  getOne,
  getCount,
  deleteOne,
  getChartCountForDatasource,
};
