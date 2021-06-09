const {
  addNewProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../../src/services/projectService');
const projectRepository = require('../../src/repository/projectRepository');
const dashboardService = require('../../src/services/dashboardService');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');
const NotFoundException = require('../../src/exceptions/NotFoundException');

jest.mock('../../src/repository/projectRepository');
jest.mock('../../src/repository/dashboardRepository');
jest.mock('../../src/services/dashboardService');

describe('Project service', () => {
  it('should add new project', async () => {
    projectRepository.insert.mockResolvedValue({ _id: 'new_id' });
    await addNewProject({ name: 'project1' });
    expect(projectRepository.insert).toHaveBeenCalledWith({ name: 'project1' });
  });
  it('should throw InvalidInputException for invalid input', async () => {
    projectRepository.insert.mockRejectedValue(new Error());

    const result = async () => {
      await addNewProject({ something: 'bad' });
    };

    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while creating new project with invalid data', 1006),
    );
  });
  it('should fetch all the saved projects', async () => {
    projectRepository.getAll.mockResolvedValue({ project: [] });
    await getAllProjects();
    expect(projectRepository.getAll).toHaveBeenCalled();
  });
  it('should fetch project with matching id', async () => {
    projectRepository.getOne.mockResolvedValue({ name: 'project' });
    await getProject('_id');
    expect(projectRepository.getOne).toHaveBeenCalledWith('_id');
  });
  it('should update project for given id', async () => {
    projectRepository.update.mockResolvedValue({ _id: 'projectId' });
    await updateProject({ id: 'projectId', name: 'new name' });
    expect(projectRepository.update).toHaveBeenCalledWith('projectId', {
      name: 'new name',
    });
  });
  it('should throw InvalidInputException for invalid input while updating', async () => {
    projectRepository.update.mockRejectedValue(new Error());

    const result = async () => {
      await updateProject({ something: 'bad' });
    };

    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while updating project with invalid data', 1007),
    );
  });

  it('should throw NotFound exception if repository return null', async () => {
    projectRepository.getOne.mockReturnValueOnce(null);

    const result = async () => {
      await getProject('projectId');
    };

    await expect(result).rejects.toThrow(
      new NotFoundException('Project with given id not found', 1012),
    );
  });
  it('should delete project with given id', async () => {
    projectRepository.deleteOne.mockReturnValueOnce({ deletedCount: 1 });
    dashboardService.deleteDashboardsAndMappingWithProjectId.mockReturnValueOnce([
      {
        deletedCount: 3,
        mappingDeletedCount: 0,
      },
    ]);

    const result = await deleteProject('projectId');
    expect(result).toEqual({
      dashboardsDeletedCount: 3,
      projectsDeleted: 1,
      mappingDeletedCount: 0,
    });
  });
  it('should throw not found exception if project id is not found', async () => {
    projectRepository.deleteOne.mockRejectedValueOnce(new Error('message'));

    const result = async () => {
      await deleteProject('projectId');
    };

    await expect(result).rejects.toThrow(
      new NotFoundException('Project with given id not found', 1012),
    );
  });
});
