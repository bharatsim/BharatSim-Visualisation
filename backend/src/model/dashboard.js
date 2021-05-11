const mongoose = require('mongoose');

const { Schema } = mongoose;
const chartSchema = new Schema(
  {
    layout: { h: Number, i: String, w: Number, x: Number, y: Number },
    dataSource: String,
    config: Object,
    chartType: String,
    chartName: String,
    dataSourceIds: [],
  },
  { _id: false },
);

const dashboard = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    charts: [chartSchema],
    layout: [Object],
    count: { type: Number, required: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'project',
    },
    notes: { type: String, default: '' },
  },

  { collection: 'dashboard' },
);

module.exports = mongoose.model('dashboard', dashboard);
