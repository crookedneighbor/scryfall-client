'use strict'

function createEmojiFunction (converter) {
  return function (text) {
    return text.replace(/{(.)(\/(.))?}/g, converter)
  }
}

module.exports = {
  slack: createEmojiFunction(':mana-$1$3:'),
  discord: createEmojiFunction(':mana$1$3:')
}
