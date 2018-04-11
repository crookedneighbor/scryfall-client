'use strict'

const convertSymbolsToSlackEmoji = require('../../../lib/convert-symbols-to-slack-emoji')

describe('convertSymbolsToSlackEmoji', function () {
  it('replaces symbols with mana named emojis', function () {
    expect(convertSymbolsToSlackEmoji('Foo {t} Bar')).to.equal('Foo :mana-t: Bar')
  })

  it('leaves text without symbols unchanged', function () {
    expect(convertSymbolsToSlackEmoji('Foo Bar')).to.equal('Foo Bar')
  })
})
