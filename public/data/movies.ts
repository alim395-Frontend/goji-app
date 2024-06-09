// data/movies.ts

export interface Movie {
  title: string;
  releaseDate: string;
  posterUrl?: string;
  description: string;
  era: string;
  alternateNames?: string[];
  rating?: number;
  genres?: string[];
  runtime?: number;
  director?: string; // Add director
  budget?: number; // Add budget
  boxOffice?: number; // Add box office
}