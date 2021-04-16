const mongoose = require('mongoose');

const { Schema } = mongoose;
function createModel(modelName, modelSkeleton, isUpdating) {
  if (isUpdating) {
    //tests pending
    delete mongoose.connection.models[modelName];
    return mongoose.model(modelName, new Schema(modelSkeleton, { collection: modelName, strict: false }));
  }
  try {
    return mongoose.model(modelName);
  } catch (error) {
    return mongoose.model(modelName, new Schema(modelSkeleton, { collection: modelName, strict: false }));
  }
}

module.exports = {
  createModel,
};
