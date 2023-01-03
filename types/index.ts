export interface RatingPoint {
  date: string;
  rating: number;

  /* Number of games for that point. */
  games: number;
}

export enum Character {
  POTEMKIN = "PO",
  KY = "KY",
  GOLDLEWIS = "GO",
  GIOVANNA = "GI",
  SIN = "SI",
  BAIKEN = "BA",
  RAMLETHAL = "RA",
}

export interface SearchResultItem {
  name: string;
  playerId: string;
  character: Character;
  games: number;
  rating: number;
}
