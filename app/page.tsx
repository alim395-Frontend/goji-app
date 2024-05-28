// app/page.tsx
import path from "path";
import fs from "fs/promises";
import { Suspense } from "react";
import Home from "../components/Home";
import { Movie } from "@/public/data/movies";
import { AudioPathProvider } from "@/context/AudioPathContext";

const Page = async () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <AudioPathProvider basePath="/sounds/godzilla">
          <Home apiEndpoint="/api/updateMoviesData"/>
        </AudioPathProvider>
      </Suspense>
  );
};

export default Page;