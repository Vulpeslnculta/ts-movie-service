import { MongoDBClient } from '@db/db-client';
import http from 'http';
import { DbMovie } from '@db/types/movie';

export const getMovies = async (req: http.IncomingMessage, res: http.ServerResponse, filter?: string) => {
  try {
    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    let movies: DbMovie[] | string[] = [];
    if (!filter) {
      movies = await dbClient.getMovies();
    } else {
      if (filter === 'titles') {
        movies = await dbClient.getTitles();
      }
    }
    await dbClient.disconnect();
    res.end(JSON.stringify(movies));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    console.log(res.statusCode);
    res.end("Internal Server Error");
  }
}

export async function addMovie(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('addMovie');
  try {
    console.log('in handler');
    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    let body = '';

    req.on('data', (chunk) => {
      console.log('data getting');
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const movie: DbMovie = JSON.parse(body);
        console.log('movie:', movie);
        if (movie) {
          await dbClient.addMovie(movie);
          console.log('movie added');
          console.log(`Movie ${movie.title} added`);
          await dbClient.disconnect();
          res.statusCode = 201;
          res.end(`Movie ${movie.title} added`);
        }
      } catch (error) {
        console.error(`Error while postMovies: ${error}`);
        res.statusCode = 400;
        res.end("Bad Request");
        await dbClient.disconnect();
      }
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
export async function deleteMovies(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    let movieToDelete: { title: string };
    req.on('data', async (data) => {
      try {
        movieToDelete = JSON.parse(data);
        if (movieToDelete) {
          const movie = await dbClient.getMovieByTitle(movieToDelete.title);
          if (movie) {
            await dbClient.deleteMovie(movie._id.toHexString());
          }
        }

      } catch (error) {
        console.error(`Error while deleteMovies: ${error}`);
        await dbClient.disconnect();
        res.statusCode = 400;
        res.end("Bad Request");
      }
      await dbClient.disconnect();
      res.statusCode = 200;
      res.end(`Movie ${movieToDelete.title} deleted`);
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export async function updateMovie(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    let movieToUpdate: { title: string, update: Partial<DbMovie> };
    req.on('data', async (data) => {
      try {
        movieToUpdate = JSON.parse(data);
        if (movieToUpdate) {
          const movie = await dbClient.getMovieByTitle(movieToUpdate.title);
          if (movie) {
            await dbClient.updateMovie(movie._id.toHexString(), movieToUpdate.update as DbMovie);
          }
        }
      } catch (error) {
        console.error(`Error while updateMovie: ${error}`);
        await dbClient.disconnect();
        res.statusCode = 400;
        res.end("Bad Request");
      }
      await dbClient.disconnect();
      res.statusCode = 200;
      res.end(`Movie ${movieToUpdate.title} updated`);
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export async function deleteMovie(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    let movieToDelete: { title: string };
    req.on('data', async (data) => {
      try {
        movieToDelete = JSON.parse(data);
        if (movieToDelete) {
          const movie = await dbClient.getMovieByTitle(movieToDelete.title);
          if (movie) {
            await dbClient.deleteMovie(movie._id.toHexString());
          }
        }

      } catch (error) {
        console.error(`Error while deleteMovie: ${error}`);
        await dbClient.disconnect();
        res.statusCode = 400;
        res.end("Bad Request");
      }
      await dbClient.disconnect();
      res.statusCode = 200;
      res.end(`Movie ${movieToDelete.title} deleted`);
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}