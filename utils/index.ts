import { Character } from "~~/types";

export function times<T>(n: number, iteratee: (i: number) => T): T[] {
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(iteratee(i));
  }
  return result;
}

const CHARACTER_NAMES: Record<Character, string> = {
  [Character.POTEMKIN]: "Potemkin",
  [Character.KY]: "Ky",
  [Character.GOLDLEWIS]: "Goldlewis",
  [Character.GIOVANNA]: "Giovanna",
  [Character.SIN]: "Sin",
  [Character.BAIKEN]: "Baiken",
  [Character.RAMLETHAL]: "Ramlethal",
};

export function formatCharacter(char: Character): string {
  return CHARACTER_NAMES[char] ?? char;
}
