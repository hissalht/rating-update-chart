export interface RatingPoint {
  date: string;
  rating: number;
  confidence: number;
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
