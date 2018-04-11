'use strict'

module.exports = function convertSymbolsToDiscordEmoji (text) {
  return text.replace(/{(.)(\/(.))?}/g, ':mana$1$3:')
}
