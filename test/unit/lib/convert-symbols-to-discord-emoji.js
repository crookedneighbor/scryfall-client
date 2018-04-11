'use strict'

const convertSymbolsToDiscordEmoji = require('../../../lib/convert-symbols-to-discord-emoji')

describe('convertSymbolsToDiscordEmoji', function () {
  it('replaces symbols with mana named emojis', function () {
    expect(convertSymbolsToDiscordEmoji('Foo {t} Bar')).to.equal('Foo :manat: Bar')
  })

  it('replaces hybrid mana symbols with mana named emojis', function () {
    expect(convertSymbolsToDiscordEmoji('Foo {u/b} Bar')).to.equal('Foo :manaub: Bar')
  })

  it('leaves text without symbols unchanged', function () {
    expect(convertSymbolsToDiscordEmoji('Foo Bar')).to.equal('Foo Bar')
  })
})
