// TODO fix this at some point
// const fs = require("fs");
// const path = require("path");
// const request = require("../../lib/request")();
// const fixturesForSingleEntities = {
//   "card-back-with-meld-layout.js": require("./card-back-with-meld-layout"),
//   "card-with-flip-layout.js": require("./card-with-flip-layout"),
//   "card-with-meld-layout.js": require("./card-with-meld-layout"),
//   "card-with-multiple-tokens.js": require("./card-with-multiple-tokens"),
//   "card-with-transform-layout.js": require("./card-with-transform-layout"),
//   "card.js": require("./card"),
//   "second-card-with-meld-layout.js": require("./second-card-with-meld-layout"),
//   "set.js": require("./set"),
// };
//
// // TODO fixtures to set to update automatically
// // 'catalog-of-card-names.js': require('./catalog-of-card-names'),
// // 'list-of-cards-page-2.js': require('./list-of-cards-page-2'),
// // 'list-of-cards.js': require('./list-of-cards'),
// // 'list-of-prints.js': require('./list-of-prints'),
// // 'list-of-rulings.js': require('./list-of-rulings'),
// // 'tokens.js': require('./tokens')
//
// Object.keys(fixturesForSingleEntities).forEach((key) => {
//   const uri = fixturesForSingleEntities[key].uri;
//
//   request(uri).then((response) => {
//     fs.writeFileSync(
//       path.join("./", "test", "fixtures", key),
//       `module.exports = ${JSON.stringify(response, null, 2)}`
//     );
//   });
// });
