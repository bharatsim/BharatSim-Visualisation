const express = require('express');
const request = require('supertest');

const dbHandler = require('../db-handler');
const projectRoutes = require('../../src/controller/projectController');
const { parseDBObject } = require('../../src/utils/dbUtils');
const ProjectModel = require('../../src/model/project');
const dashboardModel = require('../../src/model/dashboard');
const DatasourceDashboardMap = require('../../src/model/datasourceDashboardMap');

const projectData = {
  name: 'project1',
};

describe('Integration test for project api', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/project', projectRoutes);
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
  });

  describe('POST /project', () => {
    it('should add new project to database', async () => {
      const response = await request(app).post('/project').send({ projectData }).expect(200);
      const { projectId } = response.body;
      const projects = parseDBObject(
        await ProjectModel.findOne({ _id: projectId }, { __v: 0, _id: 0 }),
      );
      expect(projects).toEqual(projectData);
    });
  });
  describe('PUT /project', () => {
    it('should update project ', async () => {
      const newData = { name: 'new name' };
      const projectModel1 = new ProjectModel(projectData);
      const { _id } = await projectModel1.save();

      const response = await request(app)
        .put('/project')
        .send({ projectData: { id: _id, ...newData } })
        .expect(200);
      const { projectId } = response.body;
      const projects = parseDBObject(await ProjectModel.findOne({ _id: projectId }, { __v: 0 }));
      expect(projects).toEqual({ _id: _id.toString(), ...newData });
    });
  });

  describe('Get /project', () => {
    it('should get all projects from database', async () => {
      ProjectModel.insertMany([projectData]);
      const response = await request(app).get('/project').expect(200);
      expect(response.body.projects.length).toEqual(1);
    });
    it('should get project with matching id', async () => {
      const projectModel1 = new ProjectModel(projectData);
      const { _id } = await projectModel1.save();

      const response = await request(app).get(`/project/${_id}`).expect(200);
      expect(response.body.project).toEqual({
        _id: _id.toString(),
        name: 'project1',
      });
    });
  });
  describe('delete /project/:id', () => {
    it('should delete project along with its dashboards', async () => {
      const projectModel1 = new ProjectModel(projectData);
      const projectModel2 = new ProjectModel(projectData);
      const { _id } = await projectModel1.save();
      await projectModel2.save();
      const dashboardData = {
        name: 'dashboard1',
        charts: [],
        layout: [],
        count: 0,
        projectId: _id.toString(),
      };
      const insertedData = await dashboardModel.insertMany([dashboardData]);
      const { _id: dashboardId } = insertedData[0];
      await DatasourceDashboardMap.insertMany([
        {
          dashboardId,
          datasourceId: '313233343536373839303131',
        },
        {
          dashboardId,
          datasourceId: '313233343536373839303132',
        },
      ]);

      const projectCountBeforeDeletion = await ProjectModel.find({}).then(
        (result) => result.length,
      );
      expect(projectCountBeforeDeletion).toEqual(2);

      const result = await request(app).delete(`/project/${_id}`).expect(200);

      const projectCountAfterDeletion = await ProjectModel.find({}).then((res) => res.length);
      expect(result.body).toEqual({
        projectsDeleted: 1,
        dashboardsDeletedCount: 1,
        mappingDeletedCount: 2,
      });
      expect(projectCountAfterDeletion).toEqual(1);
    });
  });
});
