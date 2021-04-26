const mongoose = require('mongoose');
const { deleteModel } = require('../../src/utils/modelCreator');
const { getOrCreateModel } = require('../../src/utils/modelCreator');

jest.mock('mongoose');

describe('Model Creator', () => {
  it('should create data model for given skeleton', async () => {
    mongoose.model.mockImplementationOnce(() => {
      throw new Error('Model not found');
    });
    mongoose.model.mockReturnValueOnce('Model');

    const model = getOrCreateModel('modelName', { column: 'string' });

    expect(mongoose.model).toHaveBeenCalledWith('modelName', expect.any(mongoose.Schema));
    expect(mongoose.Schema).toHaveBeenCalledWith(
      { column: 'string' },
      { collection: 'modelName', strict: false },
    );
    expect(model).toEqual('Model');
  });

  it('should provide already present data model', async () => {
    mongoose.model.mockReturnValueOnce('Model');

    const model = getOrCreateModel('modelName', { column: 'string' });

    expect(mongoose.model).toHaveBeenCalledWith('modelName');
    expect(model).toEqual('Model');
  });

  it('should delete model with provided name', async () => {
    mongoose.connection = {
      models: {
        modelName: {},
        modelName2: {},
      },
    };

    deleteModel('modelName');

    expect(mongoose.connection.models.modelName).toBeUndefined();
  });
});
