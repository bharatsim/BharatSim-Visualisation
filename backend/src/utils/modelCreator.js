const mongoose = require('mongoose');

const { Schema } = mongoose;
function getOrCreateModel(modelName, modelSkeleton) {
  try {
    return mongoose.model(modelName);
  } catch (error) {
    return mongoose.model(
      modelName,
      new Schema(modelSkeleton, { collection: modelName, strict: false }),
    );
  }
}

function deleteModel(modelName) {
  delete mongoose.connection.models[modelName];
}

module.exports = {
  getOrCreateModel,
  deleteModel,
};
