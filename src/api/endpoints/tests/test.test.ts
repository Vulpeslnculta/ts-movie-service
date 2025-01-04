/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMovie } from '../movies';
import { MongoDBClient } from '@db/db-client';
import { DbMovie } from '@db/types/movie';

jest.mock('@db/db-client');

describe('Movies API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: '',
      url: '',
      on: jest.fn(),
    };

    res = {
      statusCode: 200,
      end: jest.fn(),
      setHeader: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should add a movie', async () => {
    req.method = 'POST';
    req.url = '/add-movie';

    const mockMovie: DbMovie = { title: 'New Movie' } as DbMovie;
    const requestBody = JSON.stringify(mockMovie);

    const onDataCallback = jest.fn();
    const onEndCallback = jest.fn();

    req.on = jest.fn((event, callback) => {
      if (event === 'data') {
        onDataCallback.mockImplementation(callback);
      } else if (event === 'end') {
        onEndCallback.mockImplementation(callback);
      }
      return req;
    });

    (MongoDBClient.prototype.addMovie as jest.Mock).mockResolvedValue(null);

    await addMovie(req, res);

    onDataCallback(requestBody);
    onEndCallback();

    expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
    expect(MongoDBClient.prototype.addMovie).toHaveBeenCalledWith(mockMovie);
    expect(res.statusCode).toBe(201);
    expect(res.end).toHaveBeenCalledWith(`Movie ${mockMovie.title} added`);
  });
});