// app/page.tsx
import path from "path";
import fs from "fs/promises";
import { Suspense } from "react";
import Home from "../components/Home";
import { Movie } from "../data/movies";

async function fetchMovies(): Promise<Movie[]> {
  const filePath = path.join(process.cwd(), "data", "movies.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

const Page = async () => {
  const movies = await fetchMovies();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home movies={movies} />
    </Suspense>
  );
};

export default Page;
