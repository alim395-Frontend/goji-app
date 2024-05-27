// data/movies.ts

export interface Movie {
  title: string;
  releaseDate: string;
  posterUrl?: string;
  description: string;
  era: string;
  alternateNames?: string[];
  rating?: number;
  genres?: string[]; // Add genres
  runtime?: number; // Add runtime
}