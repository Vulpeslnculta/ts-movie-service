import { getMovies, addMovie, deleteMovies, updateMovie, deleteMovie } from '../movies';
import { MongoDBClient } from '@db/db-client';
import http from 'http';
import { DbMovie } from '@db/types/movie';
import { Socket } from 'net';
import { ObjectId } from 'mongodb';

jest.mock('@db/db-client');

describe('Movies API Endpoints', () => {
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
    // req = new http.IncomingMessage(null as unknown as Socket);
    // res = new http.ServerResponse(req);
    req = {
      method: '',
      url: '',
      on: jest.fn(),
    } as unknown as http.IncomingMessage;

    res = {
      statusCode: 200,
      end: jest.fn(),
      setHeader: jest.fn(),
    } as unknown as http.ServerResponse;

    // jest.spyOn(res, 'end').mockImplementation((cb?: () => void) => {
    //   if (cb && typeof cb === 'function') { cb() };
    //   return res;
    // });
    // let statusCode = 200;
    // Object.defineProperty(res, 'statusCode', {
    //   set: (code: number) => { statusCode = code; },
    //   get: () => statusCode
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return all movies', async () => {
      const mockMovies: DbMovie[] = [{ title: 'Movie 1' }, { title: 'Movie 2' }] as DbMovie[];
      (MongoDBClient.prototype.getMovies as jest.Mock).mockResolvedValue(mockMovies);

      await getMovies(req, res);

      expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
      expect(MongoDBClient.prototype.getMovies).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockMovies));
    });

    it('should return movie titles when filter is "titles"', async () => {
      const mockTitles: string[] = ['Movie 1', 'Movie 2'];
      (MongoDBClient.prototype.getTitles as jest.Mock).mockResolvedValue(mockTitles);

      await getMovies(req, res, 'titles');

      expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
      expect(MongoDBClient.prototype.getTitles).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockTitles));
    });

    it('should handle errors', async () => {
      (MongoDBClient.prototype.connect as jest.Mock).mockRejectedValue(new Error('Connection error'));

      await getMovies(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.end).toHaveBeenCalledWith('Internal Server Error');
    });
  });
  // describe('addMovie', () => {
  // it('should add a movie', async () => {
  //   req.method = 'POST';
  //   req.url = '/add-movie';

  //   const mockMovie: DbMovie = { title: 'New Movie' } as DbMovie;
  //   const requestBody = JSON.stringify(mockMovie);

  //   const onDataCallback = jest.fn();
  //   const onEndCallback = jest.fn();

  //   req.on = jest.fn((event, callback) => {
  //     if (event === 'data') {
  //       onDataCallback.mockImplementation(callback);
  //     } else if (event === 'end') {
  //       onEndCallback.mockImplementation(callback);
  //     }
  //     return req;
  //   });

  //   (MongoDBClient.prototype.addMovie as jest.Mock).mockResolvedValue(null);

  //   await addMovie(req, res);

  //   onDataCallback(requestBody);
  //   onEndCallback();

  //   expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
  //   expect(MongoDBClient.prototype.addMovie).toHaveBeenCalledWith(mockMovie);
  //   expect(res.statusCode).toBe(201);
  //   expect(res.end).toHaveBeenCalledWith(`Movie ${mockMovie.title} added`);
  // });

  // it('should handle errors', async () => {
  //   const req = new http.IncomingMessage(null as unknown as Socket);
  //   const res = new http.ServerResponse(req);
  //   req.method = 'POST';
  //   req.url = '/add-movie';

  //   const requestBody = 'invalid json';

  //   const onDataCallback = jest.fn();
  //   const onEndCallback = jest.fn();

  //   req.on = jest.fn((event, callback) => {
  //     if (event === 'data') {
  //       onDataCallback.mockImplementation(callback);
  //     } else if (event === 'end') {
  //       onEndCallback.mockImplementation(callback);
  //     }
  //     return req;
  //   });

  //   addMovie(req, res);

  //   onDataCallback(requestBody);
  //   onEndCallback();

  //   expect(res.statusCode).toBe(400);
  //   expect(res.end).toHaveBeenCalledWith('Bad Request');
  // });
  // });

  // describe('deleteMovies', () => {
  //   it('should delete a movie', async () => {
  //     const mockMovieToDelete = { title: 'Movie to Delete' };
  //     const mockMovie: DbMovie = { _id: new ObjectId('123'), title: 'Movie to Delete' } as DbMovie;
  //     (MongoDBClient.prototype.getMovieByTitle as jest.Mock).mockResolvedValue(mockMovie);
  //     (MongoDBClient.prototype.deleteMovie as jest.Mock).mockResolvedValue(null);

  //     req.emit('data', JSON.stringify(mockMovieToDelete));
  //     await deleteMovies(req, res);

  //     expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
  //     expect(MongoDBClient.prototype.getMovieByTitle).toHaveBeenCalledWith(mockMovieToDelete.title);
  //     expect(MongoDBClient.prototype.deleteMovie).toHaveBeenCalledWith('123');
  //     expect(res.statusCode).toBe(200);
  //     expect(res.end).toHaveBeenCalledWith(`Movie ${mockMovieToDelete.title} deleted`);
  //   });

  //   it('should handle errors', async () => {
  //     req.emit('data', 'invalid json');
  //     await deleteMovies(req, res);

  //     expect(res.statusCode).toBe(400);
  //     expect(res.end).toHaveBeenCalledWith('Bad Request');
  //   });
  // });

  // describe('updateMovie', () => {
  //   it('should update a movie', async () => {
  //     const mockMovieToUpdate = { title: 'Movie to Update', update: { title: 'Updated Movie' } };
  //     const mockMovie: DbMovie = { _id: new ObjectId('123'), title: 'Movie to Update' } as DbMovie;
  //     (MongoDBClient.prototype.getMovieByTitle as jest.Mock).mockResolvedValue(mockMovie);
  //     (MongoDBClient.prototype.updateMovie as jest.Mock).mockResolvedValue(null);

  //     req.emit('data', JSON.stringify(mockMovieToUpdate));
  //     await updateMovie(req, res);

  //     expect(MongoDBClient.prototype.connect).toHaveBeenCalled();
  //     expect(MongoDBClient.prototype.getMovieByTitle).toHaveBeenCalledWith(mockMovieToUpdate.title);
  //     expect(MongoDBClient.prototype.updateMovie).toHaveBeenCalledWith('123', mockMovieToUpdate.update);
  //     expect(res.statusCode).toBe(200);
  //     expect(res.end).toHaveBeenCalledWith(`Movie ${mockMovieToUpdate.title} updated`);
  //   });

  //   it('should handle errors', async () => {
  //     req.emit('data', 'invalid json');
  //     await updateMovie(req, res);

  //     expect(res.statusCode).toBe(400);
  //     expect(res.end).toHaveBeenCalledWith('Bad Request');
  //   });
  // });
  // TODO: scream alone at night
});
