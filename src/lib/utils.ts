import jsSHA from 'jssha';

import { DbMovie } from "@db/types/movie";
import { OMDBMovie } from "./types";

export function getFromEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
}

export function formatMovie(movie: OMDBMovie): DbMovie {
  return {
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    rated: movie.Rated,
    released: movie.Released,
    runtime: movie.Runtime,
    genre: movie.Genre,
    director: movie.Director.split(',').map(d => d.trim()),
    writer: movie.Writer.split(',').map(w => w.trim()),
    actors: movie.Actors.split(',').map(a => a.trim()),
    plot: movie.Plot,
    language: movie.Language.split(',').map(l => l.trim()),
    country: movie.Country.split(',').map(c => c.trim()),
    awards: movie.Awards,
    poster: movie.Poster,
    ratings: movie.Ratings.map(r => ({
      source: r.Source,
      value: r.Value
    })),
    metascore: movie.Metascore,
    imdbRating: movie.imdbRating,
    imdbVotes: movie.imdbVotes,
    type: movie.Type,
    dvd: movie.DVD,
    boxOffice: movie.BoxOffice,
    production: movie.Production,
    website: movie.Website
  }
}

export function stringToHash(string: string): string {
  const hash = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
  hash.update(string);
  return hash.getHash("HEX");
}

