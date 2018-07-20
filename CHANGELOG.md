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
