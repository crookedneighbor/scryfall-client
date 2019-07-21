function SingularEntity (scryfallObject, config) {
  var modelName = this.constructor.SCRYFALL_MODEL_NAME

  if (scryfallObject.object !== modelName) {
    throw new Error('Object type must be "' + modelName + '"')
  }

  this._request = config.requestMethod
}

SingularEntity.setModelName = function (ChildModel, modelName) {
  ChildModel.SCRYFALL_MODEL_NAME = modelName
  ChildModel.prototype = Object.create(SingularEntity.prototype)
  ChildModel.prototype.constructor = ChildModel
}

module.exports = SingularEntity
