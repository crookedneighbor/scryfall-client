function BaseModel (scryfallObject, requestMethod) {
  var modelName = this.constructor.SCRYFALL_MODEL_NAME

  if (scryfallObject.object !== modelName) {
    throw new Error('Object type must be "' + modelName + '"')
  }

  this._request = requestMethod
}

BaseModel.setModelName = function (ChildModel, modelName) {
  ChildModel.SCRYFALL_MODEL_NAME = modelName
  ChildModel.prototype = Object.create(BaseModel.prototype)
  ChildModel.prototype.constructor = ChildModel
}

module.exports = BaseModel
