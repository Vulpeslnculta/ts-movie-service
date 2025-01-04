import { getFromEnv, formatMovie, stringToHash } from '../utils';
import { OMDBMovie } from '../types';

describe('getFromEnv', () => {
  it('should return the value of the environment variable', () => {
    process.env.TEST_KEY = 'test_value';
    expect(getFromEnv('TEST_KEY')).toBe('test_value');
  });

  it('should throw an error if the environment variable is not set', () => {
    delete process.env.TEST_KEY;
    expect(() => getFromEnv('TEST_KEY')).toThrow('TEST_KEY is not set');
  });
});

describe('formatMovie', () => {
  it('should format the movie correctly', () => {
    const omdbMovie: OMDBMovie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2021',
      Rated: 'PG-13',
      Released: '01 Jan 2021',
      Runtime: '120 min',
      Genre: 'Action, Adventure',
      Director: 'John Doe, Jane Smith',
      Writer: 'John Doe, Jane Smith',
      Actors: 'Actor One, Actor Two',
      Plot: 'This is a test movie plot.',
      Language: 'English, Spanish',
      Country: 'USA, Canada',
      Awards: 'None',
      Poster: 'http://example.com/poster.jpg',
      Ratings: [{ Source: 'Internet', Value: '10/10' }],
      Metascore: '80',
      imdbRating: '8.0',
      imdbVotes: '1000',
      Type: 'movie',
      DVD: '01 Feb 2021',
      BoxOffice: '$1000000',
      Production: 'Test Production',
      Website: 'http://example.com'
    } as unknown as OMDBMovie;

    const dbMovie = formatMovie(omdbMovie);

    expect(dbMovie).toEqual({
      id: 'tt1234567',
      title: 'Test Movie',
      year: '2021',
      rated: 'PG-13',
      released: '01 Jan 2021',
      runtime: '120 min',
      genre: 'Action, Adventure',
      director: ['John Doe', 'Jane Smith'],
      writer: ['John Doe', 'Jane Smith'],
      actors: ['Actor One', 'Actor Two'],
      plot: 'This is a test movie plot.',
      language: ['English', 'Spanish'],
      country: ['USA', 'Canada'],
      awards: 'None',
      poster: 'http://example.com/poster.jpg',
      ratings: [{ source: 'Internet', value: '10/10' }],
      metascore: '80',
      imdbRating: '8.0',
      imdbVotes: '1000',
      type: 'movie',
      dvd: '01 Feb 2021',
      boxOffice: '$1000000',
      production: 'Test Production',
      website: 'http://example.com'
    });
  });
});

describe('stringToHash', () => {
  it('should return the correct SHA-256 hash of the string', () => {
    const string = 'test_string';
    const hash = stringToHash(string);
    expect(hash).toBe('4b641e9a923d1ea57e18fe41dcb543e2c4005c41ff210864a710b0fbb2654c11');
  });
});