const router = require('express').Router();

const datasourceMetadataService = require('../services/datasourceMetadataService.js');
const datasourceService = require('../services/datasourceService.js');
const uploadDatasourceService = require('../services/uploadDatasourceService.js');
const DataSourceNotFoundException = require('../exceptions/DatasourceNotFoundException');
const ColumnsNotFoundException = require('../exceptions/ColumnsNotFoundException');
const { sendServerError, sendClientError } = require('../exceptions/exceptionUtils');
const InvalidInputException = require('../exceptions/InvalidInputException');
const NotFoundException = require('../exceptions/NotFoundException');
const { EXTENDED_JSON_TYPES } = require('../constants/fileTypes');
const { getFileExtension } = require('../utils/uploadFile');
const { fileTypes } = require('../constants/fileTypes');

router.get('/', async function(req, res) {
  const { dashboardId, projectId } = req.query;
  datasourceMetadataService
    .getDatasources({ dashboardId, projectId })
    .then((data) => res.json(data))
    .catch((err) => {
      sendServerError(err, res);
    });
});

router.post('/', async function(req, res) {
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

router.get('/:id', async function(req, res) {
  const { columns, aggregationParams } = req.query;
  const { id: datasourceId } = req.params;
  const parseAggregationParams = aggregationParams
    ? JSON.parse(aggregationParams)
    : aggregationParams;
  datasourceService
    .getData(datasourceId, columns, parseAggregationParams)
    .then((data) => res.json(data))
    .catch((err) => {
      if (err instanceof DataSourceNotFoundException) {
        sendClientError(err, res, 404);
      } else if (err instanceof ColumnsNotFoundException) {
        res.status(400).end();
      } else {
        sendServerError(err, res);
      }
    });
});

router.get('/:id/headers', function(req, res) {
  const { id: datasourceId } = req.params;
  datasourceMetadataService
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

router.delete('/', async function(req, res) {
  const { datasourceIds } = req.query;
  datasourceService
    .bulkDeleteDatasource(datasourceIds)
    .then((deleteMetadata) => {
      res.send(deleteMetadata);
    })
    .catch((err) => {
      if (err instanceof NotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});

router.delete('/:id', async function(req, res) {
  const { id: datasourceId } = req.params;
  datasourceService
    .deleteDatasource(datasourceId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err instanceof DataSourceNotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});
router.post('/:id/update', async function(req, res) {
  const { id: datasourceId } = req.params;
  const { columnName, expression } = req.body;
  datasourceService
    .updateDatasource(datasourceId, { columnName, expression })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err instanceof DataSourceNotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});

module.exports = router;
