import http from 'http';
import * as endpoint from './endpoints';
import { HttpMethod } from './types';
import { validateToken, log, userViewPermissions } from '@lib/decorators';

export class ApiClient {

  port: string;


  constructor(
    port: string,
  ) {
    this.port = port;
  }

  start() {
    console.log(`Starting server on port ${this.port}`);
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }

  checkToken(req: http.IncomingMessage, res: http.ServerResponse) {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];

      return token;
    } else {
      res.statusCode = 403
      res.end("Forbidden");
    }
  }

  @log
  @validateToken
  @userViewPermissions

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log('Request URL:', req.url);
    // #region constants
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const queryParams = url.searchParams;
    if (queryParams) {
      console.log('Query Params:', queryParams.toString());
    }
    // #endregion constants

    // #region endpoints
    // #region /movies
    if (url.pathname === "/movies") {
      if (req.method === HttpMethod.GET) {
        endpoint.movies.getMovies(req, res);
      }
      else if (req.method === HttpMethod.POST) {
        endpoint.movies.addMovie(req, res);
      }
      else if (req.method === HttpMethod.PUT) {
        endpoint.movies.updateMovie(req, res);
      }
      else if (req.method === HttpMethod.DELETE) {
        endpoint.movies.deleteMovie(req, res);

      }
      else {
        res.statusCode = 405;
        res.end("Method Not Allowed");
      }
    }
    // #endregion /movies
    // #region /movie
    else if (url.pathname === "/movie") {
      if (req.method === HttpMethod.GET) {
        endpoint.movie.getMovie(req, res);
      }
      else {
        res.statusCode = 405;
        res.end("Method Not Allowed");
      }
    }
    // #endregion /movie
    // #region /auth
    else if (url.pathname.startsWith("/auth")) {
      if (req.method === HttpMethod.POST && url.pathname === "/auth/login") {
        endpoint.user.login(req, res);
      }
      else if (req.method === HttpMethod.POST && url.pathname === "/auth/register") {
        endpoint.user.register(req, res);
      }
      else if (req.method === HttpMethod.POST && url.pathname === "/auth/changePremium") {
        endpoint.user.changePremium(req, res);
      }
      else if (req.method === HttpMethod.POST && url.pathname === "/auth/deleteUser") {
        endpoint.user.deleteUser(req, res);
      }
      else if (req.method === HttpMethod.GET && url.pathname === "/auth/allusers") {
        endpoint.user.getAllUsers(req, res);
      }
      else {
        res.statusCode = 405;
        res.end("Method Not Allowed");
      }
    }
    // #endregion /auth 
  }
} 