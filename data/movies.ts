// data/movies.ts

export interface Movie {
  title: string;
  releaseDate: string;
  posterUrl?: string;
  description: string;
  era: string;
  alternateNames?: string[];
}