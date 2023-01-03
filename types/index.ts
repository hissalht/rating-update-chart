export interface RatingPoint {
  date: string;
  rating: number;

  /* Number of games for that point. */
  games: number;
}

// TODO: properly type Character
// export enum Character {
//   POTEMKIN = "PO",
//   KY = "KY",
// }

export type Character = string;

export interface SearchResultItem {
  name: string;
  playerId: string;
  character: Character;
  games: number;
  rating: number;
}
