const DataSourceMetadata = require('../model/datasourceMetadata');
const DataSourceNotFoundException = require('../exceptions/DatasourceNotFoundException');

async function getDataSourceNames() {
  return DataSourceMetadata.find()
    .select('name')
    .then((data) => data);
}

async function getDataSourceSchemaById(dataSourceId) {
  return DataSourceMetadata.findOne({ _id: dataSourceId }, { _id: 0 })
    .select(['dataSourceSchema', 'fileType'])
    .then((data) => {
      if (!data) {
        throw new DataSourceNotFoundException(dataSourceId);
      }
      return data;
    });
}

async function insert({ name, dataSourceSchema, dashboardId, fileType, fileSize, fileId }) {
  const dataSourceMetadata = new DataSourceMetadata({
    name,
    dataSourceSchema,
    dashboardId,
    fileSize,
    fileType,
    fileId,
  });
  return dataSourceMetadata.save();
}

async function deleteDatasourceMetadata(dataSourceId) {
  await DataSourceMetadata.deleteOne({ _id: dataSourceId });
}

async function bulkDeleteDatasourceMetadata(datasourceIds) {
  await DataSourceMetadata.deleteMany({ _id: { $in: datasourceIds } });
}

function filterDatasourceIds(datasourceIds, filters) {
  return getDatasourcesMetadata(
    { _id: { $in: datasourceIds }, ...filters },
    { __v: 0, dataSourceSchema: 0 },
  );
}

async function getDataSourcesMetadataByIds(datasourceIds) {
  return getDatasourcesMetadata({ _id: { $in: datasourceIds } }, { __v: 0, dataSourceSchema: 0 });
}

function getAllExceptDatasourceIds(datasourceIds) {
  return getDatasourcesMetadata({ _id: { $nin: datasourceIds } }, { __v: 0, dataSourceSchema: 0 });
}

async function getDatasourceMetadataForDatasourceId(dataSourceId) {
  return DataSourceMetadata.findOne({ _id: dataSourceId });
}

async function getDatasourcesMetadata(filter = {}, project = {}) {
  return DataSourceMetadata.find(filter, project);
}

async function updateDatasourceSchema(datasourceId, newSchema) {
  return DataSourceMetadata.updateOne({ _id: datasourceId }, {
    $set: {
      dataSourceSchema: {
        ...newSchema,
      },
    },
  });
}

module.exports = {
  getDatasourcesMetadata,
  getDataSourceNames,
  getDataSourceSchemaById,
  insert,
  deleteDatasourceMetadata,
  getDataSourcesMetadataByIds,
  bulkDeleteDatasourceMetadata,
  getDatasourceMetadataForDatasourceId,
  filterDatasourceIds,
  getAllExceptDatasourceIds,
  updateDatasourceSchema,
};
