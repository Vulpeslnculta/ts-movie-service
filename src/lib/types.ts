// #region OMDB Types
export type OMDBMovie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export type OMDBParams = {
  year?: number;
  page?: number;
  type?: OMDBMediaTypes;
  title?: string;
  id?: string;
}
// #endregion OMDB Types

// #region OMDB Enums
export enum OMDBMediaTypes {
  movie = 'movie',
  series = 'series',
  episode = 'episode',
}

export enum OMDBQueryParams {
  id = 'i',
  title = 't',
  year = 'y',
  page = 'page',
  type = 'type',
}
// #endregion OMDB Enums