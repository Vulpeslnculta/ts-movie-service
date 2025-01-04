import http from 'http';
import jwt from 'jsonwebtoken';
import { JWTClient } from '../jwt-client';
import { RequestWithToken } from '@auth/types';
import { getFromEnv } from '@lib/utils';

// Mocks
jest.mock('jsonwebtoken');
jest.mock('@lib/utils');

describe('JWTClient', () => {
  let jwtClient: JWTClient;
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
    (getFromEnv as jest.Mock).mockReturnValue('test-secret');
    jwtClient = new JWTClient();
    req = {} as http.IncomingMessage;
    res = {
      statusCode: 200,
      end: jest.fn()
    } as unknown as http.ServerResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueToken', () => {
    it('Issue a token and send it in the response', () => {
      const userId = '123';
      const token = 'test-token';
      (jwt.sign as jest.Mock).mockImplementation((payload, key, options, callback) => {
        callback(null, token);
      });

      jwtClient.issueToken(req, res, userId);

      expect(jwt.sign).toHaveBeenCalledWith({ user: userId }, 'test-secret', { expiresIn: '1h' }, expect.any(Function));
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ token }));
    });

    it('Return 403 if there is an error signing the token', () => {
      const userId = '123';
      (jwt.sign as jest.Mock).mockImplementation((payload, key, options, callback) => {
        callback(new Error('sign error'), null);
      });

      jwtClient.issueToken(req, res, userId);

      expect(jwt.sign).toHaveBeenCalledWith({ user: userId }, 'test-secret', { expiresIn: '1h' }, expect.any(Function));
      expect(res.statusCode).toBe(403);
      expect(res.end).toHaveBeenCalledWith("Forbidden");
    });
  });

  describe('verifyToken', () => {
    it('Verify the token and send auth data in the response', () => {
      const authData = { user: '123' };
      const reqWithToken = { token: 'test-token' } as RequestWithToken;
      (jwt.verify as jest.Mock).mockImplementation((token, key, callback) => {
        callback(null, authData);
      });

      jwtClient.verifyToken(reqWithToken, res);

      expect(jwt.verify).toHaveBeenCalledWith('test-token', 'test-secret', expect.any(Function));
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(authData));
    });

    it('Return 403 if there is an error verifying the token', () => {
      const reqWithToken = { token: 'test-token' } as RequestWithToken;
      (jwt.verify as jest.Mock).mockImplementation((token, key, callback) => {
        callback(new Error('verify error'), null);
      });

      jwtClient.verifyToken(reqWithToken, res);

      expect(jwt.verify).toHaveBeenCalledWith('test-token', 'test-secret', expect.any(Function));
      expect(res.statusCode).toBe(403);
      expect(res.end).toHaveBeenCalledWith("Forbidden");
    });
  });
});