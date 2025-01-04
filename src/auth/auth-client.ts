import * as http from 'http';
import { JWTClient } from './lib/jwt-client';
import { RequestWithToken } from './types';
import { log } from '@lib/decorators/log';

export class AuthClient {
  port: string;
  server: http.Server;
  jwtClient: JWTClient;

  constructor(port: string) {
    this.port = port;
    this.jwtClient = new JWTClient();
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  start() {
    console.log(`Starting server on port ${this.port}`);
    this.server.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }

  @log
  handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method === 'POST' && req.url === '/validate-token') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { token } = JSON.parse(body);
        const requestWithToken = { ...req, token } as RequestWithToken;
        this.jwtClient.verifyToken(requestWithToken, res);
      });

      req.on('error', () => {
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    } else if (req.method === 'POST' && req.url === '/issue-token') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { userId } = JSON.parse(body);
        this.jwtClient.issueToken(req, res, userId);
      });

      req.on('error', () => {
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }
}