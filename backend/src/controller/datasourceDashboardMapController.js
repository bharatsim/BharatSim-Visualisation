const router = require('express').Router();
const { sendServerError } = require('../exceptions/exceptionUtils');

const datasourceDashboardMapService = require('../services/datasourceDashboardMapService');

router.post('/', async (req, res) => {
  const { datasourceDashboardMaps } = req.body;
  datasourceDashboardMapService
    .addDatasourceDashboardMaps(datasourceDashboardMaps)
    .then((data) => res.json(data))
    .catch((err) => {
      sendServerError(err, res);
    });
});
router.delete('/', async (req, res) => {
  const { datasourceId, dashboardId } = req.body;
  datasourceDashboardMapService
    .deleteDatasourceDashboardMap({ datasourceId, dashboardId })
    .then((data) => res.json(data))
    .catch((err) => {
      sendServerError(err, res);
    });
});

module.exports = router;
