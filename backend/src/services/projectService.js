const InvalidInputException = require('../exceptions/InvalidInputException');
const NotFoundException = require('../exceptions/NotFoundException');
const { deleteDashboardsAndMappingWithProjectId } = require('./dashboardService');
const {
  insertProjectInvalidInput,
  updateProjectInvalidInput,
  projectNotFound,
} = require('../exceptions/errors');

const { getAll, insert, getOne, update, deleteOne } = require('../repository/projectRepository');

// TODO: change name to insert
async function addNewProject(projectData) {
  try {
    const { _id } = await insert(projectData);
    return { projectId: _id };
  } catch (e) {
    throw new InvalidInputException(
      insertProjectInvalidInput.errorMessage,
      insertProjectInvalidInput.errorCode,
    );
  }
}

async function getAllProjects() {
  const projects = await getAll();
  return { projects };
}

async function getProject(projectId) {
  const project = await getOne(projectId);
  if (!project) {
    throw new NotFoundException(projectNotFound.errorMessage, projectNotFound.errorCode);
  }
  return { project };
}

async function updateProject({ id, ...projectData }) {
  try {
    await update(id, projectData);
    return { projectId: id };
  } catch (e) {
    throw new InvalidInputException(
      updateProjectInvalidInput.errorMessage,
      updateProjectInvalidInput.errorCode,
    );
  }
}

function getTotalDeleteCount(result) {
  return result.reduce(
    ({ deletedCount, mappingDeletedCount }, deleteResult) => {
      return {
        deletedCount: deletedCount + deleteResult.deletedCount,
        mappingDeletedCount: mappingDeletedCount + deleteResult.mappingDeletedCount,
      };
    },
    { deletedCount: 0, mappingDeletedCount: 0 },
  );
}

async function deleteProject(projectId) {
  let projectDeleteResult;
  try {
    projectDeleteResult = await deleteOne(projectId);
  } catch (err) {
    throw new NotFoundException(projectNotFound.errorMessage, projectNotFound.errorCode);
  }
  const dashboardsDeleteResult = await deleteDashboardsAndMappingWithProjectId(projectId);
  const { deletedCount: dashboardsDeletedCount, mappingDeletedCount } = getTotalDeleteCount(
    dashboardsDeleteResult,
  );
  return {
    projectsDeleted: projectDeleteResult.deletedCount,
    dashboardsDeletedCount,
    mappingDeletedCount,
  };
}

module.exports = {
  getAllProjects,
  addNewProject,
  getProject,
  updateProject,
  deleteProject,
};
