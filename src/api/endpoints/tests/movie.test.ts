import { getMovie } from '../movie';
import http from 'http';
import { MongoDBClient } from '@db/db-client';
import { OMDBClient } from '@lib/omdb-client';
import { formatMovie } from '@lib/utils';

jest.mock('@db/db-client');
jest.mock('@lib/omdb-client');
jest.mock('@lib/utils');

describe('getMovie', () => {
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
    req = {
      url: '',
    } as http.IncomingMessage;

    res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn(),
    } as unknown as http.ServerResponse;

    jest.clearAllMocks();
  });

  it('Returns 400 if title is not provided', async () => {
    req.url = '/api/movie';

    await getMovie(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith('title is required');
  });

  it('Returns movie from db if found', async () => {
    req.url = '/api/movie?title=Inception';
    const movie = { title: 'Inception' };
    (MongoDBClient.prototype.connect as jest.Mock).mockResolvedValue(undefined);
    (MongoDBClient.prototype.getMovieByTitle as jest.Mock).mockResolvedValue(movie);

    await getMovie(req, res);

    expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
    expect(MongoDBClient.prototype.getMovieByTitle).toHaveBeenCalledWith('Inception');
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(movie));
  });

  it('Fetches movie from OMDB and adds to db if not found in db', async () => {
    req.url = '/api/movie?title=Inception';
    const omdbMovie = { Title: 'Inception' };
    const formattedMovie = { title: 'Inception' };
    (MongoDBClient.prototype.connect as jest.Mock).mockResolvedValue(undefined);
    (MongoDBClient.prototype.getMovieByTitle as jest.Mock).mockResolvedValue(null);
    (OMDBClient.prototype.getMovie as jest.Mock).mockResolvedValue(omdbMovie);
    (formatMovie as jest.Mock).mockReturnValue(formattedMovie);
    (MongoDBClient.prototype.addMovie as jest.Mock).mockResolvedValue(undefined);

    await getMovie(req, res);

    expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
    expect(MongoDBClient.prototype.getMovieByTitle).toHaveBeenCalledWith('Inception');
    expect(OMDBClient.prototype.getMovie).toHaveBeenCalledWith({ title: 'Inception' });
    expect(formatMovie).toHaveBeenCalledWith(omdbMovie);
    expect(MongoDBClient.prototype.addMovie).toHaveBeenCalledWith(formattedMovie);
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(formattedMovie));
  });

  it('Returns 500 if an error occurs', async () => {
    req.url = '/api/movie?title=Inception';
    (MongoDBClient.prototype.connect as jest.Mock).mockRejectedValue(new Error('DB error'));

    await getMovie(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });
});