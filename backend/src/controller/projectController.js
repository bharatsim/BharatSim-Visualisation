const router = require('express').Router();
const InvalidInputException = require('../exceptions/InvalidInputException');
const NotFoundException = require('../exceptions/NotFoundException');
const { sendClientError, sendServerError } = require('../exceptions/exceptionUtils');
const {
  addNewProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../services/projectService');

router.post('/', async function (req, res) {
  const { projectData } = req.body;
  addNewProject(projectData)
    .then((projectId) => {
      res.send(projectId);
    })
    .catch((err) => {
      if (err instanceof InvalidInputException) {
        sendClientError(err, res);
      } else {
        sendServerError(err, res);
      }
    });
});
router.put('/', async function (req, res) {
  const { projectData } = req.body;
  updateProject(projectData)
    .then((projectId) => {
      res.send(projectId);
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
  getAllProjects()
    .then((projects) => {
      res.send(projects);
    })
    .catch((err) => {
      sendServerError(err, res);
    });
});

router.get('/:id', async function (req, res) {
  const { id: projectId } = req.params;
  getProject(projectId)
    .then((project) => {
      res.send(project);
    })
    .catch((err) => {
      if (err instanceof NotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});

router.delete('/:id', async function (req, res) {
  const { id: projectId } = req.params;
  deleteProject(projectId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err instanceof NotFoundException) {
        sendClientError(err, res, 404);
      } else {
        sendServerError(err, res);
      }
    });
});

module.exports = router;
