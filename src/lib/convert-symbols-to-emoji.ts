import type { TextTransformFunction } from "Types/text-transform";

function createEmojiFunction(converter: string): TextTransformFunction {
  return function (text: string) {
    return text.replace(/{(.)(\/(.))?}/g, converter);
  };
}

export const slack = createEmojiFunction(":mana-$1$3:");
export const discord = createEmojiFunction(":mana$1$3:");
