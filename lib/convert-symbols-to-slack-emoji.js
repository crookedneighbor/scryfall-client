'use strict'

module.exports = function convertSymbolsToSlackEmoji (text) {
  return text.replace(/{(.)(\/(.))?}/g, ':mana-$1$3:')
}
