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
  return DataSourceMetadata.updateOne(
    { _id: datasourceId },
    {
      $set: {
        dataSourceSchema: newSchema,
      },
    },
  );
}

async function addCustomColumn(datasourceId, { name, expression }) {
  return DataSourceMetadata.updateOne(
    { _id: datasourceId },
    {
      $push: {
        customColumns: {
          name,
          expression,
        },
      },
    },
  );
}

async function updateCustomColumn(datasourceId, { name, expression }) {
  return DataSourceMetadata.updateOne(
    { _id: datasourceId, 'customColumns.name': name },
    {
      $set: {
        'customColumns.$.expression': expression,
      },
    },
  );
}

async function findCustomColumn(datasourceId, columnName) {
  return DataSourceMetadata.findOne({ _id: datasourceId, 'customColumns.name': columnName });
}

async function deleteCustomColumn(datasourceId, columnName) {
  return DataSourceMetadata.updateOne(
    { _id: datasourceId },
    {
      $pull: {
        customColumns: { name: columnName },
      },
    },
  );
}

async function updateOrInsertCustomColumn(datasourceId, { name, expression }) {
  const isPresent = await findCustomColumn(datasourceId, name);
  if (isPresent) {
    return updateCustomColumn(datasourceId, { name, expression });
  }
  return addCustomColumn(datasourceId, { name, expression });
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
  addCustomColumn,
  deleteCustomColumn,
  updateOrInsertCustomColumn,
};
