const router = require('express').Router();

const InvalidInputException = require('../exceptions/InvalidInputException');
const { sendClientError, sendServerError } = require('../exceptions/exceptionUtils');

const {
  saveDashboard,
  getAllDashboards,
  insertDashboard,
  getDashboard,
  deleteDashboard,
} = require('../services/dashboardService');

// TODO: Refactor APIS for new dashboard

router.post('/', async function (req, res) {
  const { dashboardData } = req.body;
  saveDashboard(dashboardData)
    .then((dashboardId) => {
      res.send(dashboardId);
    })
    .catch((err) => {
      if (err instanceof InvalidInputException) {
        sendClientError(err, res);
      } else {
        sendServerError(err, res);
      }
    });
});

router.post('/create-new', async function (req, res) {
  const { dashboardData } = req.body;
  insertDashboard(dashboardData)
    .then((dashboardId) => {
      res.send(dashboardId);
    })
    .catch((err) => {
      if (err instanceof InvalidInputException) {
        sendClientError(err, res);
      } else {
        sendServerError(err, res);
      }
    });
});

router.get('/', async function (req, res) {
  const { columns, ...filters } = req.query;
  getAllDashboards(filters, columns)
    .then((dashboards) => {
      res.send(dashboards);
    })
    .catch((err) => {
      sendServerError(err, res);
    });
});

router.get('/:id', async function (req, res) {
  const { id: dashboardId } = req.params;
  getDashboard(dashboardId)
    .then((dashboards) => {
      res.send(dashboards);
    })
    .catch((err) => {
      sendServerError(err, res);
    });
});

router.delete('/:id', async function (req, res) {
  const { id: dashboardId } = req.params;
  deleteDashboard(dashboardId)
    .then((deleteMetadata) => {
      res.send(deleteMetadata);
    })
    .catch((err) => {
      sendServerError(err, res);
    });
});

module.exports = router;
