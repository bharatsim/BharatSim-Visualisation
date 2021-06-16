const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./src/controller/datasourcesController');
const datasourceDashboardMapRoutes = require('./src/controller/datasourceDashboardMapController');
const dashBoardRoutes = require('./src/controller/dashboardController');
const projectRoutes = require('./src/controller/projectController');

const LOGGER_FORMAT_STRING = ':method :url :status :res[content-length] - :response-time ms';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: '../dev.env' });
}

const PORT = process.env.APP_PORT;

require('./setupDB');

const FILE_UPLOAD_PATH = './uploads/';

morgan.token('param', function (req, res, param) {
  return req.params[param];
});

const app = express();

app.use(morgan(LOGGER_FORMAT_STRING));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: FILE_UPLOAD_PATH }).single('datafile'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/dashboard-datasource-map', datasourceDashboardMapRoutes);
app.use('/api/datasources', apiRoutes);
app.use('/api/dashboard', dashBoardRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/*', (req, res) => {
  res.status(404).end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
