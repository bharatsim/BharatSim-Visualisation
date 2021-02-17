const dbConstants = require('../constants/dbConstants');

function getIncludedColumnMap(columns) {
  const columnsMap = {};
  columns.forEach((col) => {
    columnsMap[col] = 1;
  });
  return columnsMap;
}

function getProjectedColumns(columns) {
  if (!columns) {
    return dbConstants.EXCLUDED_COLUMNS_V;
  }
  return getIncludedColumnMap(columns);
}

function parseDBObject(records) {
  return JSON.parse(JSON.stringify(records));
}

function changeRecordDimensionToArray(records) {
  const parsedRecords = parseDBObject(records);
  const columns = Object.keys(parsedRecords[0]);
  return columns.reduce((acc, column) => {
    acc[column] = records.map((row) => row[column]);
    return acc;
  }, {});
}

function getAggregateParam(aggregateColumns, aggregate) {
  return aggregateColumns.reduce((acc, col) => {
    const action = `$${aggregate[col]}`;
    acc[col] = { [action]: `$${col}` };
    return acc;
  }, {});
}

function getGroupByParams(groupBy) {
  return groupBy.reduce((acc, col) => {
    acc[col] = `$${col}`;
    return acc;
  }, {});
}

function getProjectAggregateParam(aggregateColumns) {
  return aggregateColumns.reduce((acc, col) => {
    acc[col] = `$${col}`;
    return acc;
  }, {});
}

function getProjectGroupByParam(groupBy) {
  return groupBy.reduce((acc, col) => {
    acc[col] = `$_id.${col}`;
    return acc;
  }, {});
}

function transformAggregationParams(aggregationParams) {
  const { groupBy, aggregate } = aggregationParams;
  const aggregateColumns = Object.keys(aggregate);

  const aggregateParam = getAggregateParam(aggregateColumns, aggregate);
  const groupByParam = getGroupByParams(groupBy);
  const projectAggregateParam = getProjectAggregateParam(aggregateColumns);
  const projectGroupByParam = getProjectGroupByParam(groupBy);

  return { aggregateParam, groupByParam, projectAggregateParam, projectGroupByParam };
}

function createSchema(row) {
  return Object.keys(row).reduce((acc, element) => {
    acc[element] = typeof row[element];
    return acc;
  }, {});
}

module.exports = {
  getProjectedColumns,
  changeRecordDimensionToArray,
  createSchema,
  parseDBObject,
  transformAggregationParams,
};
