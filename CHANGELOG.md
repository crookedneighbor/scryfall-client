# 0.18.6

- Remove use of Node's querystring module to support current versions of Webpack

# 0.18.5

- Fix issue where `getSybmolUrl` could not parse symbols longer than one character

# 0.18.4

- Fix back face constant for cards without a back face

# 0.18.3

- Fix `getSymbolUrl` to handle lowercase mana symbols

# 0.18.2

- Fix `getSymbolUrl` to return the correct url prefix

# 0.18.1

- Update img.scryfall.com domains to c1.scryfall.com
- Update prices type to be strings or null

# 0.18.0

- Provide types for models at `scryfall-client/dist/types/model`

# 0.17.0

- Include `warnings` and `not_found` arrays in Lists resolved from `getCollection`

_Breaking Changes_

- `getCollection` returns an List of Card objects (reverting the previous releases breaking change)
- Default `warnings` and `not_found` to empty arrays in Lists

# 0.16.0

- Automatically batch requests to the getCollection endpoint when identifiers exceed 75 entries

_Breaking Changes_

- `getCollection` returns an Array of Card objects instead of a List of Card objects

# 0.15.0

- Add keywords to card model type
- Add content_warning to card model type
- Provide default values for booster and content_warning properties in card model

_Breaking Changes_

- Drop getCards method because the /cards endpoint is deprecated in the Scryfall API

# 0.14.2

- Fix issue where extended-promise module was not in dependencies

# 0.14.1

- Fix paths to modules

# 0.14.0

- Add typescript types
- Add `setTextTransform` method to process text from request responses
- Add `slackify` method to automatically convert mana symobls into slack emoji text
- Add `discordify` method to automatically convert mana symobls into slack emoji text
- Add `resetTextTransform` method to reset text transformation
- Add `setApiRequestDelayTime` method to set delay time between requests
- Add `resetApiRequestDelayTime` method to reset delay time between requests to default (100 milliseconds)
- Add `search` method to make basic searches easier
- Add `random` method to make random query easier
- Add `autocomplete` method to make card name lookups easier
- Add `getSets` method to make fetching all set objects easier
- Add `getSet` method to make fetching a set object by set code or scryfall id easier
- Add `getSetByTcgId` method to make fetching a set object by TCG Player id
- Add `getCollection` method to make looking up numerous cards easier
- Add `getCard` method to make looking up single card easier
- Add `getCards` method to make looking up all cards easier
- Add `getCardNamed` method to make looking up single card by name easier
- Add `getCardBySetCodeAndCollectorNumber` method to make looking up single card by set code and collector number easier

_Breaking Changes_

- Switch from class style module to singleton object
- Rename `Set` model to `MagicSet` to avoid collision with global `Set` object
- No longer throws an error for missing or unrecognized legality win `Card.isLegal` method.

# 0.13.0

- Fallback to lookup tokens from other prints when card has no tokens but rules text mentions tokens

# 0.12.0

- Add `post` method (closes #9)
- Add `getSymbolUrl` method to client (closes #11)
- Fix error when calling `getTokens` on a card without multiple parts (closes #10)

_Breaking Changes_

- Remove `symbols` file in favor of `getSymbolUrl`

# 0.11.0

- Normalize card_faces so all card objects have a card_faces array

_Breaking Changes_

- meld cards are not considered double sided, and will not resolve in the `getBackImage` method
- `getImage` returns syncronously and throws errors when image uris do not exist or an invalid image option is provided
- `getBackImage` returns a single value syncrounsly and throws errors when image uris do not exist or an invalid image option is provided

# 0.10.1

- Fix issue where request header was set incorrectly

# 0.10.0

- add `getTaggerUrl` method to card object
- swap out request module for `superagent` for better browser support

_Breaking Changes_

- move `symbols` off of the main Scryfall object and put it at the base level: `require('scryfall-client/symbols')`

# 0.9.0

- Add `getPrice` method to card object
- Add `getTokens` method to card object

# 0.8.2

- Fix issue where null values were not handled properly

# 0.8.1

- Fix issue where melded cards could not fetch the backside image

# 0.8.0

- Fix issue where `next` method was not available in browser contexts

# 0.7.0

- Add thrown error property when wrapping scryfall response to illuminate the problem when parsing the response
- Add svg urls for mana symbols

# 0.6.0

- Add `textTransformer` option to constructor

# 0.5.0

- Add `wrap` method

# 0.4.0

- Add [Scryfall recomended delay between requests](https://scryfall.com/docs/api#rate-limits-and-good-citizenship)

# 0.3.0

- All error properties are exposed on error object

_Breaking Changes_

- Error object now passes http status as `status` instead of `httpStatus`

# 0.2.1

- Put get method on prototype of ScryfallClient for easier stubbing in testing

# 0.2.0

- Support strings converting mana symbols ({m}) to Slack emoji syntax (:mana-m:)
- Support strings converting mana symbols ({m}) to Discord emoji syntax (:manam:)

_Breaking Changes_

- Module is now instantiated as an instance

# 0.1.0

_Breaking Changes_

- Requests that return a [catalog](https://scryfall.com/docs/api/catalogs) now return an array like object directly, rather than having the array nested in a `data` attribute.

# 0.0.1

- Initial release
