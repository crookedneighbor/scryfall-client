function BaseModel (scryfallObject, requestMethod) {
  var modelName = this.constructor.SCRYFALL_MODEL_NAME

  if (scryfallObject.object !== modelName) {
    throw new Error('Object type must be "' + modelName + '"')
  }

  this._request = requestMethod
}

module.exports = BaseModel
