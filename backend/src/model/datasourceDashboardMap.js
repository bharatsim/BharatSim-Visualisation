const mongoose = require('mongoose');

const { Schema } = mongoose;

const DatasourceDashboardMap = new Schema({
  dashboardId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'dashboard',
  },
  datasourceId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'datasourceMetadata',
  },
});

module.exports = mongoose.model('DatasourceDashboardMap', DatasourceDashboardMap);
