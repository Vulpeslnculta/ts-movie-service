import { OMDBClient } from '@lib/omdb-client';
import http from 'http';
import { MongoDBClient } from '@db/db-client';
import { formatMovie } from '@lib/utils';

export const getMovie = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    console.log('getMovie');
    const query = req.url ? req.url.split('?')[1] : '';
    console.log(query);
    const params = new URLSearchParams(query);
    console.log(params);
    const title = params.get('title');
    if (!title) {
      res.statusCode = 400;
      res.end("title is required");
      return;
    }
    console.log(title);

    const dbClient = new MongoDBClient("movies");
    await dbClient.connect();
    console.log(`title: ${title}`);
    const movie = await dbClient.getMovieByTitle(title);

    if (movie) {
      console.log(`movie: ${movie.title} found in db`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(movie));
    } else {
      console.log(`movie: ${title} not found in db`);
      const omdbClient = new OMDBClient();
      const omdbMovie = await omdbClient.getMovie({ title });
      const formattedMovie = formatMovie(omdbMovie);
      await dbClient.addMovie(formattedMovie);
      console.log(`movie: ${JSON.stringify(formattedMovie)} added to db`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(formattedMovie));
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};



