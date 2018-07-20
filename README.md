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

You can use this in conjunction with the `symbols` property on the Object to display the symbols using the svgs for the symbols found on Scryfall's website.

```js
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient({
  textTransformer: function (text) {
    var matches = text.match(/{(.)(\/(.))?}/g)

    if (matches) {
      matches.forEach(function (symbol) {
        var key = symbol.slice(1, -1)

        text = text.replace(symbol, '<img src="' + ScryfallClient.symbols[key] + '"/>')
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

Representing a [card object](https://scryfall.com/docs/api/cards)

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

Returns a Promise that resolves with the image url of the specified size. Defaults to the `normal` size. 

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
  return card.getImage()
}).then(function (img) {
  img // set an img tag's src to this
})
```

### getBackImage(String size='normal') -> Array<String>

Returns a Promise that resolves with an Array of image urls of the back of the card. In almost all cases, this will resolve with an Array with 1entry that is [Scryfall's URL for the backside of a card](https://img.scryfall.com/errors/missing.jpg). For [transform cards](https://scryfall.com/search?q=layout%3Atransform), it will resolve with an Array with one entry that is the back face of the card. For the front side of [meld cards](https://scryfall.com/search?q=layout%3Ameld), it will resolve with an Array with 1 entry that is the melded version of the card. FOr the back side of [meld cards](https://scryfall.com/search?q=layout%3Ameld), it will resolve with an Array of two urls, which are the two front sides of the card.

The default format parameter is `'normal'`. As of the writing of this documentation, the valid values are:

```
'small'
'normal'
'large'
'png'
'art_crop'
'border_crop'
```

If additional formats are added, `getImage` will support them automatically (as it takes its list of valid values from the API response itself).

If a non-transform or non-meld card is used with `getBackImage`, the size parameter will be ignored.

```js
// A Magic card without a back face
scryfall.get('cards/named', {
  exact: 'windfall'
}).then(function (card) {
  return card.getBackImage()
}).then(function (imgs) {
  imgs[0] // https://img.scryfall.com/errors/missing.jpg
})

// A transform card
scryfall.get('cards/named', {
  exact: 'docent of perfection'
}).then(function (card) {
  return card.getBackImage()
}).then(function (imgs) {
  imgs[0] // the img url for Final Iteration
})

// Front side of a meld card
scryfall.get('cards/named', {
  exact: 'Gisela, the Broken Blade'
}).then(function (card) {
  return card.getBackImage()
}).then(function (imgs) {
  imgs[0] // the img url for Brisela, Voice of Nightmares
})

// Back side of a meld card
scryfall.get('cards/named', {
  exact: 'Brisela, Voice of Nightmares'
}).then(function (card) {
  return card.getBackImage()
}).then(function (imgs) {
  imgs[0] // the img url for Bruna, the Fading Light 
  imgs[1] // the img url for Gisela, the Broken Blade
})
```

This is, admittedly, a bit of a wonky design pattern, but necessary to accomadate meld cards. If you have a better idea for it, suggestions and PRs are welcome!

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

  let card = scryfall.wrap(cardData)

  return card.getImage()
}).then(function (img) {
  // the image of the card saved in the database
})
```

# Contributing Guidelines

## Code Style

This code is intentionally written in ES5 without any transpilers so that it can be built for the browser without the need to use transpilers such as Babel.

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
