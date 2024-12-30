import http from 'http';
import jwt from 'jsonwebtoken';

import { RequestWithToken } from '@auth/types';
import { getFromEnv } from '@lib/utils';

export class JWTClient {

  key: string;

  constructor() {
    this.key = getFromEnv('JWT_SECRET');
  }


  issueToken(req: http.IncomingMessage, res: http.ServerResponse, userId: string) {
    jwt.sign({ user: userId }, this.key, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        res.statusCode = 403;
        res.end("Forbidden");
      } else {
        res.end(JSON.stringify({ token }));
      }
    }
    );
  }

  verifyToken(req: RequestWithToken, res: http.ServerResponse) {
    jwt.verify(req.token, this.key, (err, authData) => {
      if (err) {
        res.statusCode = 403;
        res.end("Forbidden");
      } else {
        console.log('AuthData:', JSON.stringify(authData));
        res.end(JSON.stringify(authData));
      }
    });
  }
}