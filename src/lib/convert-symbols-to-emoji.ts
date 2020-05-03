"use strict";

function createEmojiFunction(converter: string) {
  return function (text: string) {
    return text.replace(/{(.)(\/(.))?}/g, converter);
  };
}

export const slack = createEmojiFunction(":mana-$1$3:");
export const discord = createEmojiFunction(":mana$1$3:");
