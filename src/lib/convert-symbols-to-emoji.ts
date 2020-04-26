"use strict";

function createEmojiFunction(converter: string) {
  return function (text: string) {
    return text.replace(/{(.)(\/(.))?}/g, converter);
  };
}

export default {
  slack: createEmojiFunction(":mana-$1$3:"),
  discord: createEmojiFunction(":mana$1$3:"),
};
