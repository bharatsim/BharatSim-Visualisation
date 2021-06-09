const mongoose = require('mongoose');

const { Schema } = mongoose;

const customColumn = new Schema({
  name: String,
  expression: String,
});

const datasourceMetadata = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dataSourceSchema: {
      type: Object,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileId: {
      type: String,
    },
    customColumns: [customColumn],
  },
  { collection: 'datasourceMetadata', timestamps: true },
);

const DatasourceMetadata = mongoose.model('datasourceMetadata', datasourceMetadata);
module.exports = DatasourceMetadata;
