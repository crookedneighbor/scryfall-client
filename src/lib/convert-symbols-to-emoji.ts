import type { TextTransformFunction } from "../types/text-transform";

function createEmojiFunction(converter: string): TextTransformFunction {
  return function (text: string): string {
    return text.replace(/{(.)(\/(.))?}/g, converter);
  };
}

export const slack = createEmojiFunction(":mana-$1$3:");
export const discord = createEmojiFunction(":mana$1$3:");
