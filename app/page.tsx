// app/page.tsx
import path from "path";
import fs from "fs/promises";
import { Suspense } from "react";
import Home from "../components/Home";
import { Movie } from "@/public/data/movies";
import { AudioPathProvider } from "@/context/AudioPathContext";

async function fetchMovies(): Promise<Movie[]> {
  const filePath = path.join(process.cwd(), 'public', "data", "movies.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

const Page = async () => {
  const movies = await fetchMovies();
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <AudioPathProvider basePath="/sounds/godzilla">
          <Home />
        </AudioPathProvider>
      </Suspense>
  );
};

export default Page;