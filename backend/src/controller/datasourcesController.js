const router = require('express').Router();

const dataSourceMetadataService = require('../services/datasourceMetadataService.js');
const dataSourceService = require('../services/datasourceService.js');
const uploadDatasourceService = require('../services/uploadDatasourceService.js');
const DataSourceNotFoundException = require('../exceptions/DatasourceNotFoundException');
const ColumnsNotFoundException = require('../exceptions/ColumnsNotFoundException');
const { sendServerError, sendClientError } = require('../exceptions/exceptionUtils');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { EXTENDED_JSON_TYPES } = require('../constants/fileTypes');
const { getFileExtension } = require('../utils/uploadFile');
const { fileTypes } = require('../constants/fileTypes');

router.get('/', async function (req, res) {
  const { dashboardId } = req.query;
  dataSourceMetadataService
    .getDataSourcesByDashboardId(dashboardId)
    .then((data) => res.json(data))
    .catch((err) => {
      sendServerError(err, res);
    });
});

router.post('/', async function (req, res) {
  uploadDatasourceService
    .uploadFile(req.file, req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      if (err instanceof InvalidInputException) {
        sendClientError(err, res);
      } else {
        sendServerError(err, res);
      }
    })
    .finally(() => {
      const fileTypesToBePreserved = [fileTypes.JSON, ...EXTENDED_JSON_TYPES];
      if (!fileTypesToBePreserved.includes(getFileExtension(req.file.originalname))) {
        uploadDatasourceService.deleteUploadedFile(req.file.path);
      }
    });
});

router.get('/:id', async function (req, res) {
  const { columns } = req.query;
  const { id: datasourceId } = req.params;
  dataSourceService
    .getData(datasourceId, columns)
    .then((data) => res.json(data))
    .catch((err) => {
      if (err instanceof DataSourceNotFoundException) {
        sendClientError(err, res, 404);
      } else if (err instanceof ColumnsNotFoundException) {
        res.status(200).end();
      } else {
        sendServerError(err, res);
      }
    });
});

router.get('/:id/headers', function (req, res) {
  const { id: datasourceId } = req.params;
  dataSourceMetadataService
    .getHeaders(datasourceId)
    .then((headers) => res.json(headers))
    .catch((err) => {
      if (err instanceof DataSourceNotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});

router.delete('/', async function (req, res) {
  const { dashboardId } = req.query;
  dataSourceService
    .deleteDatasourceForDashboard(dashboardId)
    .then((deleteMetadata) => {
      res.send(deleteMetadata);
    })
    .catch((err) => {
      sendServerError(err, res);
    });
});
module.exports = router;
