## Scryfall Client

A simple (unofficial) wrapper for the [Scryfall API](https://scryfall.com/docs/api).

# Installation

```
npm install --save scryfall-client
```

The module is a singleton object that can make requests to the Scryfall API.

```js
var scryfall = require("scryfall-client");
```

# Why?

For the most part, this is a wrapper around the Scryfall API that provides convenience methods for the resulting API objects.

The goal is to provide a convenient way to get data from the Scryfall API in a succient manner. For the most part, each API object will mirror the documented properties on the Scryfall API and include a set of helper methods to make navigating the data easier.

The one key difference between the response objects returned from the raw API and this module is that for endpoints that return the [list object](https://scryfall.com/docs/api/lists), the raw API returns an object with some properties about the list (`has_more`, `next_page`, `total_cards`) and a `data` property that is an array of other API objects (cards, prints, rulings, etc). This module returns an Array-like object of the data directly, with the properties attached to the object. Similiraly, endpoints that return the [catalog object](https://scryfall.com/docs/api/catalogs) returns an Array-like object containing the data, as well as the other properties on the catalog.

```js
scryfall.search("o:vigilance t:equipment").then(function (list) {
  list.has_more; // whether or not there is an additional page of results, `true` or `false`
  list.total_cards; // the total number of cards returned from search

  var names = list.map(function (card) {
    // the list object can use any Array method
    return card.name;
  });
});
```

If your request returns no results or is otherwise unsuccessful, the Promise will reject.

```js
scryfall
  .search("foobarbaz")
  .then(function (list) {
    // will never get here
  })
  .catch(function (err) {
    err; // a 404 error
  });
```

The other responses ([`Card`](#card), [`MagicSet`](#magicset), etc) are wrappers around the objects and any devitations or additional methods are noted in the [Models section](#models).

# Basic Usage

## `search(searchString: string, options?: object)` -> Promise<[List](#list)<[Card](#card)>>

Perform a [Scryfall search](https://scryfall.com/docs/api/cards/search), where `searchString` is the `q` parameter.

```js
scryfall.search("o:vigilance t:equipment").then(function (list) {
  list.has_more; // whether or not there is an additional page of results, `true` or `false`
  list.total_cards; // the total number of cards returned from search

  var names = list.map(function (card) {
    // the list object can use any Array method
    return card.name;
  });
});
```

You can pass additional query params as an options object. `format` and `pretty` are not supported.

```js
scryfall
  .search("o:vigilance t:equipment", {
    unique: "prints",
    order: "usd",
    dir: "desc",
    include_extras: true,
    include_multilingual: true,
    include_variations: true,
    page: 2,
  })
  .then(function (list) {
    // do something with list of cards
  });
```

## `autocomplete(searchString: string, options?: object)` -> Promise<[Catalog](#catalog)>

Perform a [Scryfall autocomplete search](https://scryfall.com/docs/api/cards/autocomplete), where `searchString` is the `q` parameter.

```js
scryfall.autocomplete("Thal").then(function (list) {
  // [
  //   "Thallid",
  //   "Thalakos Seer",
  //   "Thalakos Scout",
  //   "Thalakos Sentry",
  //   "Thalia's Lancers",
  //   "Thallid Devourer",
  //   "Thallid Omnivore",
  //   "Thalakos Drifters",
  //   "Thalakos Mistfolk",
  //   "Thalakos Lowlands",
  //   "Thalakos Deceiver",
  //   "Thallid Soothsayer",
  //   "Thallid Germinator",
  //   "Thalia's Lieutenant",
  //   "Thalia's Geistcaller",
  //   "Thallid Shell-Dweller",
  //   "Thalia, Heretic Cathar",
  //   "Thalakos Dreamsower",
  //   "Thalia, Guardian of Thraben",
  //   "Thorn Thallid"
  // ]
});
```

You can pass additional query params as an options object. `format` and `pretty` are not supported.

```js
scryfall
  .search("o:vigilance t:equipment", {
    unique: "prints",
    order: "usd",
    dir: "desc",
    include_extras: true,
    include_multilingual: true,
    include_variations: true,
    page: 2,
  })
  .then(function (list) {
    // do something with list of cards
  });
```

## `getCard(idOrName: string, kind?: string = "scryfall")` -> Promise<[Card](#card)>

You can get a card object through a variety of API routes. By default, just passing an ID will return a card by looking up the Scryfall ID.

Available `kind` options are:

- `id` (alias for `scryfall`)
- `scryfall`
- `multiverse`
- `arena`
- `mtgo` (Magic Online ID)
- `tcg` (TCG Player ID)
- `fuzzyName`
- `name` (alias for `fuzzyName`)
- `exactName`

Find card by [Scryfall id](https://scryfall.com/docs/api/cards/id):

```js
scryfall.getCard("scryfall-id").then(function (card) {
  // do something with card
});

// can also be expicit about it by providing a kind
scryfall.getCard("scryfall-id", "scryfall").then(function (card) {
  // do something with card
});
```

Find card by [multiverse id](https://scryfall.com/docs/api/cards/multiverse):

```js
scryfall.getCard(1234, "multiverse").then(function (card) {
  // do something with card
});
```

Find card by [arena id](https://scryfall.com/docs/api/cards/arena):

```js
scryfall.getCard(1234, "arena").then(function (card) {
  // do something with card
});
```

Find card by [Magic Online id](https://scryfall.com/docs/api/cards/mtgo):

```js
scryfall.getCard(1234, "mtgo").then(function (card) {
  // do something with card
});
```

Find card by [TCG Player id](https://scryfall.com/docs/api/cards/tcgplayer):

```js
scryfall.getCard("id", "tcg").then(function (card) {
  // do something with card
});
```

Find card by [fuzzy name](https://scryfall.com/docs/api/cards/named):

```js
scryfall.getCard("fuzzy name", "fuzzyName").then(function (card) {
  // do something with card
});
```

Alternatively, just use `name` alias:

```js
scryfall.getCard("fuzzy name", "name").then(function (card) {
  // do something with card
});
```

Find card by [exact name](https://scryfall.com/docs/api/cards/named):

```js
scryfall.getCard("exact name", "exactName").then(function (card) {
  // do something with card
});
```

## `getCardNamed(name: string, options?: object)` -> Promise<[Card](#card)>

```js
scryfall.getCardNamed("fuzzy name").then(function (card) {
  // do something with card
});
```

Get exact name:

```js
scryfall.getCardNamed("exact name", { kind: "exact" }).then(function (card) {
  // do something with card
});
```

Get a card, but specify the printing based on set code:

```js
scryfall.getCardNamed("teferi time", { set: "dom" }).then(function (card) {
  // do something with card
});
```

## `random(searchString?: string)` -> Promise<[Card](#card)>

Get a random card:

```js
scryfall.random().then(function (card) {
  // do something with card
});
```

Get a random card that matches a search string:

```js
scryfall.random("rarity:mythic").then(function (card) {
  // random card that has been printed at mythic
});
```

## `getCardBySetCodeAndCollectorNumber(setCode: string, collectorNumber: string, lang?: string)` -> Promise<[Card](#card)>

Find a card by passing the set code and collector number.

```js
scryfall
  .getCardBySetCodeAndCollectorNumber("set code", "123")
  .then(function (card) {
    // do something with card
  });
```

Optionally pass a language parameter:

```js
scryfall
  .getCardBySetCodeAndCollectorNumber("set code", "123", "es")
  .then(function (card) {
    // do something with card
  });
```

## `getCards(page: number = 1)` -> Promise<[List](#list)<[Card](#card)>>

Fetch all the cards:

```js
scryfall.getCards().then(function (cards) {
  // do something with cards
});
```

Fetch all the cards starting on a page other than 1:

```js
scryfall.getCards(5).then(function (cards) {
  // do something with cards
});
```

## `getSets()` -> Promise<[List](#list)<[MagicSet](#magicset)>>

Perform a [lookup for all the sets](https://scryfall.com/docs/api/sets/all).

```js
scryfall.getSets().then(function (sets) {
  sets.forEach(function (set) {
    // do something with set
  });
});
```

## `getSet(setCodeOrScryfallId: string)` -> Promise<[MagicSet](#magicset)>

Perform a [lookup for a particular Magic set by the code](https://scryfall.com/docs/api/sets/code) or [Scryfall ID](https://scryfall.com/docs/api/sets/id).

```js
scryfall.getSet("dom").then(function (set) {
  set.name; // "Dominaria"
  set.code; // "dom"
});
```

```js
scryfall.getSet("2ec77b94-6d47-4891-a480-5d0b4e5c9372").then(function (set) {
  set.name; // "Ultimate Masters"
  set.code; // "uma"
});
```

## `getSetByTcgId(tcgId: number)` -> Promise<[MagicSet](#magicset)>

Perform a [lookup for a particular Magic set by the TCG Player ID](https://scryfall.com/docs/api/sets/tcgplayer).

```js
scryfall.getSetByTcgId(1909).then(function (set) {
  set.name; // "Amonkhet Invocations"
  set.code; // "mp2"
});
```

## `getCollection(identifiers: object[])` -> Promise<Array<[Card](#card)>>

Perform a [Scryfall collections request](https://scryfall.com/docs/api/cards/collection), where `identifiers` is the `identifiers` parameter.

```js
scryfall
  .getCollection([
    {
      id: "683a5707-cddb-494d-9b41-51b4584ded69",
    },
    {
      name: "Ancient Tomb",
    },
    {
      set: "mrd",
      collector_number: "150",
    },
  ])
  .then(function (collection) {
    collection[0].name; // Lodestone Golem
    collection[1].name; // Ancient Tomb
    collection[2].name; // Chalice of the Void
  });
```

Normally, the collection API endpoint restricts requests to 75 identifiers. This module will automatically batch the requests in increments of 75 identifiers and then resolve with a flattened array of cards (not a List object).

# Advanced Usage

## `get(url: string, query?: object)` -> Promise

If the exact API call you're looking for is missing, you can make a get request directly to any of the [API endpoints](https://scryfall.com/docs/api). It will return a Promise that resolves with the result.

```js
scryfall.get("cards/random").then(function (card) {
  card; // a random card
});
```

You can pass a second argument that will be converted to a query string:

```js
scryfall
  .get("cards/search", {
    q: "o:vigilance t:equipment",
  })
  .then(function (list) {
    list.forEach(function (card) {
      console.log(card.name);
    });
  });
```

## `post(url: string, body?: object)` -> Promise

You can also call `post` with a post body:

```js
scryfall
  .post("cards/collection", {
    identifiers: [
      {
        id: "some-id",
      },
      {
        set: "some-set-code",
        collector_number: "some-collector-number",
      },
    ],
  })
  .then(function (list) {
    list.forEach(function (card) {
      console.log(card.name);
    });
  });
```

## `getSymbolUrl`

As a convenience, you can call `getSymbolUrl` with a symbol character to generate the Scryfall url for the symbols svg:

```js
scryfall.getSymbolUrl("W"); // 'https://img.scryfall.com/symbology/W.svg'

scryfall.getSymbolUrl("{U}"); // 'https://img.scryfall.com/symbology/U.svg'
```

## `setTextTransformer`

A function that yields the text of the fields of the card, whatever the function returns will replace the text.

The main use case is for transforming the mana symbol notation. You can use the `getSymbolUrl` method in conjunction with the textTransformer function to embed the mana symbols on a web page.

```js
scryfall.setTextTransform(function (text) {
    var matches = text.match(/{(.)(\/(.))?}/g);

    if (matches) {
      matches.forEach(function (symbol) {
        var key = symbol.slice(1, -1);

        text = text.replace(
          symbol,
          '<img src="' + scryfall.getSymbolUrl(key) + '"/>'
        );
      });
    }

    return text;
  },
});

scryfall
  .get("cards/named", {
    exact: "River Hoopoe",
  })
  .then(function (card) {
    // Flying\n<img src="https://img.scryfall.com/symbology/3.svg" /><img src="https://img.scryfall.com/symbology/G.svg" /><img src="https://img.scryfall.com/symbology/U.svg" />: You gain 2 life and draw a card.
    card.oracle_text;
  });
```

It is probably easiest to copy the function above as is, and replace the second argument in `text.replace` with your own string where `$1` is the first match and `$3` is the second match if the mana symbols is a split symbol (such as with hybrid mana).

## `slackify`

If using this module within Slack, you may want the mana symbols converted automatically to the [emoji that Scryfall provides](https://scryfall.com/docs/slack-bot#manamoji-support).

```js
scryfall.slackify();

scryfall.get("cards/random").then(function (card) {
  card.mana_cost; // ':mana-2::mana-G:
});
```

## `discordify`

If using this module within Discord, you may want the mana symbols converted automatically to the [emoji that Scryfall provides](https://scryfall.com/docs/discord-bot#manamoji-usage).

```js
scryfall.discordify();

scryfall.get("cards/random").then(function (card) {
  card.mana_cost; // ':mana2::manaG:
});
```

## `resetTextTransform`

To reset the text transformation to the defaults, use `resetTextTransform`.

```js
scryfall.resetTextTransform();
```

## `setApiRequestDelayTime`

By default, there is about 50-100 milliseceond delay between requests ([as recomended by Scryfall](https://scryfall.com/docs/api#rate-limits-and-good-citizenship)). You can configure this value.

```js
scryfall.setApiRequestDelayTime(500);

scryfall
  .get("cards/random")
  .then(function (card) {
    // do something with card

    // will wait 500 milliseconds before initiating this request
    return scryfall.get("cards/random");
  })
  .then(function (card) {
    // do something with card
  });
```

## `resetApiRequestDelayTime`

To reset the delay time back to the default, use `resetApiRequestDelayTime`.

```js
scryfall.resetApiRequestDelayTime();
```

# Models

As a convenience, there are a number of API objects with special methods.

## Card

Representing a [card object](https://scryfall.com/docs/api/cards). Normally, only double faced cards will have a `card_faces` array, but the `Card` instance will always include a `card_faces` array, defaulting to the main attributes from the card if the card does not have multiple faces.

### `getRulings()` -> Promise<[List](#list)>

Returns a Promise that resolves with a list of [rulings objects](https://scryfall.com/docs/api/rulings)

```js
scryfall
  .get("cards/named", {
    fuzzy: "aust com",
  })
  .then(function (card) {
    return card.getRulings();
  })
  .then(function (list) {
    list.forEach(function (ruling) {
      console.log(ruling.published_at);
      console.log(ruling.comment);
    });
  });
```

### `getSet()` -> Promise<[MagicSet](#magicset)>

Returns a Promise that resolves with the [set object](https://scryfall.com/docs/api/sets) for the card.

```js
scryfall
  .get("cards/named", {
    exact: "the Scarab God",
  })
  .then(function (card) {
    return card.getSet();
  })
  .then(function (set) {
    set.name; // the name of the set
  });
```

### `getPrints()` -> Promise<List>

Returns a Promise that resolves with a list of [card objects](https://scryfall.com/docs/api/cards) for each printing of the card.

```js
scryfall
  .get("cards/named", {
    exact: "windfall",
  })
  .then(function (card) {
    return card.getPrints();
  })
  .then(function (list) {
    var sets = list.map(function (card) {
      return card.set;
    });
  });
```

### `isLegal(String format)` -> `Boolean`

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
scryfall
  .get("cards/search", {
    q: "format:standard r:r",
  })
  .then(function (list) {
    var aCard = list[0];

    aCard.isLegal("standard"); // true
    aCard.isLegal("pauper"); // false
  });
```

### `getImage(String size='normal')` -> `String`

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
scryfall
  .get("cards/named", {
    exact: "windfall",
  })
  .then(function (card) {
    const img = card.getImage();
    img; // set an img tag's src to this
  });
```

### `getBackImage(String size='normal')` -> `String`

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
scryfall
  .get("cards/named", {
    exact: "windfall",
  })
  .then(function (card) {
    const img = card.getBackImage(); // https://img.scryfall.com/errors/missing.jpg
  });

// A transform card
scryfall
  .get("cards/named", {
    exact: "docent of perfection",
  })
  .then(function (card) {
    const img = card.getBackImage(); // the img url for Final Iteration
  });
```

### `getPrice(String type)` -> `String`

Returns a string with the specifed price. If the price is not available for the specified type, `''` will be returned.

If no type is specified, it will return the price for `'usd'` if available. If `'usd'` is not available, `'usd_foil'` will be used. If `'usd_foil'` is not available, `'eur'` will be used. If `'eur'` is not available, `'tix'` will be used. If `'tix'` is not available, `''` will be returned.

```js
scryfall
  .get("cards/named", {
    fuzzy: "animar soul",
  })
  .then(function (card) {
    card.getPrice(); // '11.25'
    card.getPrice("usd"); // '11.25'
    card.getPrice("usd_foil"); // '52.51'
  });
```

### `getTokens()` -> Promise<List>

Returns a Promise that resolves with a list of [card objects](https://scryfall.com/docs/api/cards) for each token associated with the card.

```js
scryfall
  .get("cards/named", {
    exact: "Bestial Menace",
  })
  .then(function (card) {
    return card.getTokens();
  })
  .then(function (list) {
    const imgs = list.map(function (card) {
      return card.getImage();
    });

    imgs.forEach(function (img) {
      // display image
    });
  });
```

### `getTaggerUrl()` -> `String (beta)`

Returns a url for the tagger page for the card. This is derived from the card attributes based on the structure of the current tagger urls. If the structure changes, this method will no longer point to the correct url.

```js
scryfall
  .get("cards/named", {
    exact: "Krenko, Mob Boss",
  })
  .then(function (card) {
    return card.getTaggerUrl();
  })
  .then(function (url) {
    url; // https://tagger.scryfall.com/card/ddt/52
  });
```

## Catalog

An object representing a [catalog object](https://scryfall.com/docs/api/catalogs). This is an Array like object where the entries are the `data` attribute from the raw API. The rest of the properties are present on the `Catalog`.

## List

An object representing a [list object](https://scryfall.com/docs/api/lists). This is an Array like object where the entries are the `data` attribute from the raw API. The rest of the properties are present on the `List`.

### `next()` -> Promise<[List](#list>>

If the `has_more` property is `true`, then `next()` can be called to get the next page of results.

```js
function collectCards(list, allCards) {
  allCards = allCards || [];
  allCards.push.apply(allCards, list);

  if (!list.has_more) {
    return allCards;
  }

  return list.next().then(function (newList) {
    return collectCards(newList, allCards);
  });
}

scryfall
  .get("cards/search", {
    q: "format:standard r:r",
  })
  .then(function (list) {
    return collectCards(list);
  })
  .then(function (allRareCardsInStandard) {
    // do something!!
  });
```

## MagicSet

An object represnting a [set object](https://scryfall.com/docs/api/sets).

### `getCards()` -> `[List](#list)<[Card](#card)>`

Resolves with a list containing all the cards in the set.

```js
scryfall
  .get("sets/dom")
  .then(function (set) {
    return set.getCards();
  })
  .then(function (list) {
    list; // a list of cards for the set
  });
```

## Other Objects

Any other objects are wrapped in a `GenericScryfallResponse` object.

# `wrap`

The instance includes a `wrap` method which can be used to wrap a saved respone from Scryall into the API objects listed above. For instance, you may want to convert a Card object into a JSON string to save to your database; this method allows you to rebuild the Card object with all the helper methods without fetching it again from Scryfall.

```js
scryfall.get("cards/random").then(function (card) {
  saveCardToDatabse(card);
});

// later

lookUpCardInDatabase(someId).then(function (cardData) {
  // cardData.getImage does not exist

  const card = scryfall.wrap(cardData);
  const img = card.getImage(); // the image of the card saved in the database
});
```

# Browser Support

The source code is written in Typescript and transpiled to ES5.

The module makes use of the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object, so if this SDK is used in a browser that does not support promises, it will need to be polyfilled in your script.

# Contributing Guidelines

## Code Style

The code base uses [Prettier](https://prettier.io/). Run:

```sh
npm run pretty
```

## Testing

To lint and run the unit tests, simply run:

```sh
npm test
```

To run just the unit tests, run:

```sh
npm run test:unit
```

To run just the linting command, run:

```sh
npm run lint
```

To run the integration tests, run:

```sh
npm run test:integration
```

To run the publishing test, run:

```sh
npm run test:publishing
```

## Bugs

If you find a bug, feel free to [open an issue](https://github.com/crookedneighbor/scryfall-client/issues/new) or [a Pull Request](https://github.com/crookedneighbor/scryfall-client/compare).

The same goes for missing Typescript properties. If the Scryfall API adds a new property, open an issue or PR to add it to the module.
