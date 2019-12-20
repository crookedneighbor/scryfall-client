Scryfall Client
---------------

A simple (unofficial) wrapper for the [Scryfall API](https://scryfall.com/docs/api).

# Installation

```
npm install --save scryfall-client
```

# Basic Usage

You can make a get request to any of the [API endpoints](https://scryfall.com/docs/api). It will return a Promise that resolves with the result.

```js
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient()

scryfall.get('cards/random').then(function (card) {
  card // a random card
})
```

You can pass a second argument that will be converted to a query string:

```js
scryfall.get('cards/search', {
  q: 'o:vigilance t:equipment'
}).then(function (list) {
  list.forEach(function (card) {
    console.log(card.name)
  })
})
```

There is one key difference between the response objects returned from the raw API and this module. For endpoints that return the [list object](https://scryfall.com/docs/api/lists), the raw API returns an object with some properties about the list (`has_more`, `next_page`, `total_cards`) and a `data` property that is an array of other API objects (cards, prints, rulings, etc). This module returns an Array-like object of the data directly, with the properties attached to the object.


```js
scryfall.get('cards/search', {
  q: 'o:vigilance t:equipment'
}).then(function (list) {
  list.has_more // whether or not there is an additional page of results, `true` or `false`
  list.total_cards // the total number of cards returned from search

  var names = list.map(function (card) { // the list object can use any Array method
    return card.name
  })
})
```


If your request returns no results or is otherwise unsuccessful, the Promise will reject.

```js
scryfall.get('cards/search', {
  q: 'foobarbaz'
}).then(function (list) {
  // will never get here
}).catch(function (err) {
  err // a 404 error
})
```

# Additional Options

You can pass in an options object when creating your client.

## `textTransformer`

A function that yields the text of the fields of the card, whatever the function returns will replace the text.

The main use case is for transforming the mana symbol notation. The module has a symbols property which is an object with a key for [each mana symbol that Scryfall uses](https://scryfall.com/docs/api/card-symbols). You can use these symbols in conjunction with the textTransformer function to embed the mana symbols on a web page.

You can use this in conjunction with the `symbols` lib provided with the module to display the symbols using the svgs for the symbols found on Scryfall's website.

```js
var ScryfallClient = require('scryfall-client')
var symbols = require('scryfall-client/symbols')
var scryfall = new ScryfallClient({
  textTransformer: function (text) {
    var matches = text.match(/{(.)(\/(.))?}/g)

    if (matches) {
      matches.forEach(function (symbol) {
        var key = symbol.slice(1, -1)

        text = text.replace(symbol, '<img src="' + symbols[key] + '"/>')
      })
    }

    return text
  }
})

scryfall.get('cards/named', {
  exact: 'River Hoopoe'
}).then(function (card) {
  card.oracle_text
  // Flying\n<img src="a_long_string_of_characters_that_render_the_3_generic_mana_symbol" /><img src="a_long_string_of_characters_that_render_the_green_mana_symbol" /><img src="a_long_string_of_characters_that_render_the_blue_mana_symbol" />: You gain 2 life and draw a card.
})
```

It is probably easiest to copy the function above as is, and replace the second argument in `text.replace` with your own string where `$1` is the first match and `$3` is the second match if the mana symbols is a split symbol (such as with hybrid mana).

If a `textTransformer` option is provided, it will take precedence over `convertSymbolsToSlackEmoji` and `convertSymbolsToDiscordEmoji`.

## `convertSymbolsToSlackEmoji`

If using this module within Slack, you may want the mana symbols converted automatically to the [emoji that Scryfall provides](https://scryfall.com/docs/slack-bot#manamoji-support).

```js
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient({
  convertSymbolsToSlackEmoji: true
})

scryfall.get('cards/random').then(function (card) {
  card.mana_cost // ':mana-2::mana-G:
})
```

If a `convertSymbolsToSlackEmoji` option is provided, it will take precedence over `convertSymbolsToDiscordEmoji`.

## `convertSymbolsToDiscordEmoji`

If using this module within Discord, you may want the mana symbols converted automatically to the [emoji that Scryfall provides](https://scryfall.com/docs/discord-bot#manamoji-usage).

```js
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient({
  convertSymbolsToDiscordEmoji: true
})

scryfall.get('cards/random').then(function (card) {
  card.mana_cost // ':mana2::manaG:
})
```

## `delayBetweenRequests`

By default, there is about 50-100 milliseceond delay between requests ([as recomended by Scryfall](https://scryfall.com/docs/api#rate-limits-and-good-citizenship)). You can configure this value.

var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient({
  delayBetweenRequests: 500
})

scryfall.get('cards/random').then(function (card) {
  // do something with card

  // will wait 500 milliseconds before initiating this request
  return scryfall.get('cards/random')
}).then(function (card) {
  // do something with card
})

# API Objects

As a convenience, there are a number of API objects with special methods.

## Card

Representing a [card object](https://scryfall.com/docs/api/cards). In additioan, all card objects will include a `card_faces` array, defaulting to the attributes from the card if the card does not have multiple faces.

### getRulings() -> Promise<List>

Returns a Promise that resolves with a list of [rulings objects](https://scryfall.com/docs/api/rulings)

```js
scryfall.get('cards/named', {
  fuzzy: 'aust com'
}).then(function (card) {
  return card.getRulings()
}).then(function (list) {
  list.forEach(function (ruling) {
    console.log(ruling.published_at)
    console.log(ruling.comment)
  })
})
```

### getSet() -> Promise<Set>

Returns a Promise that resolves with the [set object](https://scryfall.com/docs/api/sets) for the card.

```js
scryfall.get('cards/named', {
  exact: 'the Scarab God'
}).then(function (card) {
  return card.getSet()
}).then(function (set) {
  set.name // the name of the set
})
```

### getPrints() -> Promise<List>

Returns a Promise that resolves with a list of [card objects](https://scryfall.com/docs/api/cards) for each printing of the card.

```js
scryfall.get('cards/named', {
  exact: 'windfall'
}).then(function (card) {
  return card.getPrints()
}).then(function (list) {
  var sets = list.map(function (card) {
    return card.set
  })
})
```

### isLegal(String format) -> Boolean

Returns true or false for provided format. As of the writing of this documentation, the valid values are:

```
'standard'
'future'
'frontier'
'modern'
'legacy'
'pauper'
'vintage'
'penny'
'commander'
'1v1'
'duel'
'brawl'
```

As more formats are added, `isLegal` will support them automatically (as it takes its list of valid values from the API response itself).

`isLegal` will return `true` if Scryfall lists the card as `legal` or `restricted` and `false` otherwise.

```js
scryfall.get('cards/search', {
  q: 'format:standard r:r'
}).then(function (list) {
  var aCard = list[0]

  aCard.isLegal('standard') // true
  aCard.isLegal('pauper') // false
})
```

### getImage(String size='normal') -> String

Returns the image url of the specified size. Defaults to the `normal` size.

As of the writing of this documentation, the valid values are:

```
'small'
'normal'
'large'
'png'
'art_crop'
'border_crop'
```

If additional formats are added, `getImage` will support them automatically (as it takes its list of valid values from the API response itself).

```js
scryfall.get('cards/named', {
  exact: 'windfall'
}).then(function (card) {
  const img = card.getImage()
  img // set an img tag's src to this
})
```

### getBackImage(String size='normal') -> String

Returns the image url of the back of the card. In almost all cases, this will return [Scryfall's URL for the backside of a card](https://img.scryfall.com/errors/missing.jpg). For [transform cards](https://scryfall.com/search?q=layout%3Atransform). It will return the image url for the back face of the card.

The default format parameter is `'normal'`. As of the writing of this documentation, the valid values are:

```
'small'
'normal'
'large'
'png'
'art_crop'
'border_crop'
```

If additional formats are added, `getBackImage` will support them automatically (as it takes its list of valid values from the API response itself).

If a non-doublesided card is used with `getBackImage`, the size parameter will be ignored.

```js
// A Magic card without a back face
scryfall.get('cards/named', {
  exact: 'windfall'
}).then(function (card) {
  const img = card.getBackImage() // https://img.scryfall.com/errors/missing.jpg
})

// A transform card
scryfall.get('cards/named', {
  exact: 'docent of perfection'
}).then(function (card) {
  const img = card.getBackImage() // the img url for Final Iteration
})
```

### getPrice(String type) -> String

Returns a string with the specifed price. If the price is not available for the specified type, `''` will be returned.

If no type is specified, it will return the price for `'usd'` if available. If `'usd'` is not available, `'usd_foil'` will be used. If `'usd_foil'` is not available, `'eur'` will be used. If `'eur'` is not available, `'tix'` will be used. If `'tix'` is not available, `''` will be returned.

```js
scryfall.get('cards/named', {
  fuzzy: 'animar soul'
}).then(function (card) {
  card.getPrice() // '11.25'
  card.getPrice('usd') // '11.25'
  card.getPrice('usd_foil') // '52.51'
})
```

### getTokens() -> Promise<List>

Returns a Promise that resolves with a list of [card objects](https://scryfall.com/docs/api/cards) for each token associated with the card.

```js
scryfall.get('cards/named', {
  exact: 'Bestial Menace'
}).then(function (card) {
  return card.getTokens()
}).then(function (list) {
  const imgs = list.map(function (card) {
    return card.getImage()
  })

  imgs.forEach(function (img) {
    // display image
  })
})
```

### getTaggerUrl() -> String (beta)

Returns a url for the tagger page for the card. This is derived from the card attributes based on the structure of the current tagger urls. If the structure changes, this method will no longer point to the correct url.

```js
scryfall.get('cards/named', {
  exact: 'Krenko, Mob Boss'
}).then(function (card) {
  return card.getTaggerUrl()
}).then(function (url) {
  url // https://tagger.scryfall.com/card/ddt/52
})
```

## Catalog

An object representing a [catalog object](https://scryfall.com/docs/api/catalogs). This is an Array like object where the entries are the `data` attribute from the raw API. The rest of the properties are present on the `Catalog`.

## List

An object representing a [list object](https://scryfall.com/docs/api/lists). This is an Array like object where the entries are the `data` attribute from the raw API. The rest of the properties are present on the `List`.

### next() -> Promise<List>

If the `has_more` property is `true`, then `next()` can be called to get the next page of results.

```js
function collectCards (list, allCards) {
  allCards = allCards || []
  allCards.push.apply(allCards, list)

  if (!list.has_more) {
    return allCards
  }

  return list.next().then(function (newList) {
    return collectCards(newList, allCards)
  })
}

scryfall.get('cards/search', {
  q: 'format:standard r:r'
}).then(function (list) {
  return collectCards(list)
}).then(function (allRareCardsInStandard) {
  // do something!!
})
```

## Set

An object represnting a [set object](https://scryfall.com/docs/api/sets).

### getCards() -> List<Card>

Resolves with a list containing all the cards in the set.

```js
scryfall.get('sets/dom').then(function (set) {
  return set.getCards()
}).then(function (list) {
  list // a list of cards for the set
})
```

## Other Objects

Any other objects are wrapped in a `GenericScryfallResponse` object.

# `wrap`

The instance includes a `wrap` method which can be used to wrap a saved respone from Scryall into the API objects listed above. For instance, you may want to convert a Card object into a JSON string to save to your database; this method allows you to rebuild the Card object with all the helper methods without fetching it again from Scryfall.

```js
scryfall.get('cards/random').then(function (card) {
  saveCardToDatabse(card)
})

// later

lookUpCardInDatabase(someId).then(function (cardData) {
  // cardData.getImage does not exist

  const card = scryfall.wrap(cardData)
  const img = card.getImage() // the image of the card saved in the database
})
```

# Browser Support

This code is intentionally written in ES5 without any transpilers so that it can be built for the browser without the need to use transpilers such as Babel.

The module does make use of the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object, so if this SDK is used in a browser that does not support promises, it will need to be polyfilled in your script.

# Contributing Guidelines

## Code Style

The code base uses [Standard](https://www.npmjs.com/package/standard).

## Testing

To lint and run the unit tests, simply run:

```
npm test
```

To run just the unit tests, run:

```
npm run test:unit
``

To run just the linting command, run:

```
npm run lint
``

To run the integration tests, run:

```
npm run test:integration
```

To run the publishing test, run:

```
npm run test:publishing
```

## Bugs

If you find a bug, feel free to [open an issue](https://github.com/crookedneighbor/scryfall-client/issues/new) or [a Pull Request](https://github.com/crookedneighbor/scryfall-client/compare).
