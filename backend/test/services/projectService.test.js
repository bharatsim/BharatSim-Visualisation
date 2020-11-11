const {
  addNewProject,
  getAllProjects,
  getProject,
  updateProject,
} = require('../../src/services/projectService');
const projectRepository = require('../../src/repository/projectRepository');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');
const NotFoundException = require('../../src/exceptions/NotFoundException');

jest.mock('../../src/repository/projectRepository');

describe('Project service', function () {
  it('should add new project', async function () {
    projectRepository.insert.mockResolvedValue({ _id: 'new_id' });
    await addNewProject({ name: 'project1' });
    expect(projectRepository.insert).toHaveBeenCalledWith({ name: 'project1' });
  });
  it('should throw InvalidInputException for invalid input', async function () {
    projectRepository.insert.mockRejectedValue(new Error());

    const result = async () => {
      await addNewProject({ something: 'bad' });
    };

    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while creating new project with invalid data', 1006),
    );
  });
  it('should fetch all the saved projects', async function () {
    projectRepository.getAll.mockResolvedValue({ project: [] });
    await getAllProjects();
    expect(projectRepository.getAll).toHaveBeenCalled();
  });
  it('should fetch project with matching id', async function () {
    projectRepository.getOne.mockResolvedValue({ name: 'project' });
    await getProject('_id');
    expect(projectRepository.getOne).toHaveBeenCalledWith('_id');
  });
  it('should update project for given id', async function () {
    projectRepository.update.mockResolvedValue({ _id: 'projectId' });
    await updateProject({ id: 'projectId', name: 'new name' });
    expect(projectRepository.update).toHaveBeenCalledWith('projectId', {
      name: 'new name',
    });
  });
  it('should throw InvalidInputException for invalid input while updating', async function () {
    projectRepository.update.mockRejectedValue(new Error());

    const result = async () => {
      await updateProject({ something: 'bad' });
    };

    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while updating project with invalid data', 1007),
    );
  });

  it('should throw NotFound exception if repository return null', async function () {
    projectRepository.getOne.mockReturnValueOnce(null);

    const result = async () => {
      await getProject('projectId');
    };

    await expect(result).rejects.toThrow(
      new NotFoundException('Project with given id not found', 1012),
    );
  });
});
