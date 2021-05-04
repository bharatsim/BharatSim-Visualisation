const mongoose = require('mongoose');

const dataSourceMetadata = [
  {
    name: 'model_1',
    dataSourceSchema: {
      hour: 'Number',
      susceptible: 'Number',
    },
    fileSize: 123,
    fileType: 'csv',
    fileId: 'fileIdByMulter',
  },
  {
    name: 'model_2',
    dataSourceSchema: {
      hour_: 'Number',
      susceptible_: 'Number',
    },
    fileSize: 123,
    fileType: 'csv',
    fileId: 'fileIdByMulter',
  },
];

function createDatasourceDashboardMapping(datasourceId) {
  return [
    {
      dashboardId: '313233343536373839303137',
      datasourceId,
    },
    {
      dashboardId: '313233343536373839303138',
      datasourceId,
    },
  ];
}

const createModel = (modelName) => {
  try {
    return mongoose.model(modelName);
  } catch (e) {
    return mongoose.model(modelName, {
      hour: 'Number',
      susceptible: 'Number',
      city: 'string',
    });
  }
};

const model1Data = [
  { hour: 0, susceptible: 1, city: 'pune' },
  { hour: 1, susceptible: 2, city: 'pune' },
  { hour: 2, susceptible: 3, city: 'pune' },
  { hour: 3, susceptible: 4, city: 'pune' },
  { hour: 4, susceptible: 5, city: 'pune' },
];

module.exports = {
  dataSourceMetadata,
  model1Data,
  createModel,
  createDatasourceDashboardMapping,
};
