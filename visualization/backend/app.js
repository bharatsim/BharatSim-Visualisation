const express = require('express');
const multer = require('multer');
const morgan = require('morgan');

const LOGGER_FORMAT_STRING = ':method :url :status :res[content-length] - :response-time ms';
const apiRoutes = require('./src/controller/datasourcesController.js');
const dashBoardRoutes = require('./src/controller/dashboardController.js');
const projectRoutes = require('./src/controller/projectController.js');
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

const port = 3005;

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/datasources', apiRoutes);
app.use('/dashboard', dashBoardRoutes);
app.use('/projects', projectRoutes);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
