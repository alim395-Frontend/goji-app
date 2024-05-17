// data/movies.ts

export interface Movie {
  title: string;
  releaseDate: string;
  posterUrl?: string;
  description: string;
  era: string;
  alternateNames: string[]; // Add alternateNames property
}

export const movies: Movie[] = [
  {
    title: "Godzilla",
    releaseDate: "1954-11-03",
    description: "A prehistoric monster, Godzilla, is awakened by nuclear tests in the Pacific.",
    era: "Showa",
    alternateNames: ["Gojira"], // Add alternate names
  },
  {
    title: "Godzilla Raids Again",
    releaseDate: "1955-04-24",
    description: "Godzilla returns to menace Japan, and the Japanese military must put an end to his reign of terror.",
    era: "Showa",
    alternateNames: ["Gojira no Gyakushū"],
  },
  // Add more movies here with appropriate era, description, and alternate names
].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
