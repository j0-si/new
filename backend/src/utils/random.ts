export const chars = {
  numbers: "0123456789",
  letterLC: "abcdefghijklmnopqrstuvwxyz",
  letterUC: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  symbols: "-_"
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomstr(length: number, characters?: string): string {
  if (!characters) characters = chars.letterLC + chars.letterUC + chars.numbers;
  length = Math.round(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.at(Math.round(random(0, characters.length - 1)));
  }
  return result;
}