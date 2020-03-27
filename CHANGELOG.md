# unreleased
* Add `post` method (closes #9)

# 1.11.0
* Normalize card_faces so all card objects have a card_faces array

_Breaking Changes_

* meld cards are not considered double sided, and will not resolve in the `getBackImage` method
* `getImage` returns syncronously and throws errors when image uris do not exist or an invalid image option is provided
* `getBackImage` returns a single value syncrounsly and throws errors when image uris do not exist or an invalid image option is provided

# 0.10.1
* Fix issue where request header was set incorrectly

# 0.10.0
* add `getTaggerUrl` method to card object
* swap out request module for `superagent` for better browser support

_Breaking Changes_
* move `symbols` off of the main Scryfall object and put it at the base level: `require('scryfall-client/symbols')`

# 0.9.0
* Add `getPrice` method to card object
* Add `getTokens` method to card object

# 0.8.2
* Fix issue where null values were not handled properly

# 0.8.1
* Fix issue where melded cards could not fetch the backside image

# 0.8.0
* Fix issue where `next` method was not available in browser contexts

# 0.7.0
* Add thrown error property when wrapping scryfall response to illuminate the problem when parsing the response
* Add svg urls for mana symbols

# 0.6.0
* Add `textTransformer` option to constructor

# 0.5.0
* Add `wrap` method

# 0.4.0
* Add [Scryfall recomended delay between requests](https://scryfall.com/docs/api#rate-limits-and-good-citizenship)

# 0.3.0

* All error properties are exposed on error object

_Breaking Changes_
* Error object now passes http status as `status` instead of `httpStatus`

# 0.2.1

* Put get method on prototype of ScryfallClient for easier stubbing in testing

# 0.2.0

* Support strings converting mana symbols ({m}) to Slack emoji syntax (:mana-m:)
* Support strings converting mana symbols ({m}) to Discord emoji syntax (:manam:)

_Breaking Changes_
* Module is now instantiated as an instance

# 0.1.0

_Breaking Changes_
* Requests that return a [catalog](https://scryfall.com/docs/api/catalogs) now return an array like object directly, rather than having the array nested in a `data` attribute.

# 0.0.1

* Initial release
