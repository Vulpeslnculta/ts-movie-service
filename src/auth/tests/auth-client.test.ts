import { AuthClient } from '../auth-client';
import * as http from 'http';
import { JWTClient } from '../lib/jwt-client';
import { Socket } from 'net';

jest.mock('http');
jest.mock('../lib/jwt-client');

describe('AuthClient', () => {
  let authClient: AuthClient;
  let mockServer: jest.Mocked<http.Server>;
  let mockJWTClient: jest.Mocked<JWTClient>;

  beforeEach(() => {
    mockServer = {
      listen: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<http.Server>;

    mockJWTClient = {
      verifyToken: jest.fn(),
      issueToken: jest.fn(),
    } as unknown as jest.Mocked<JWTClient>;

    (http.createServer as jest.Mock).mockReturnValue(mockServer);
    (JWTClient as jest.Mock).mockImplementation(() => mockJWTClient);

    authClient = new AuthClient('3000');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Start the server on the specified port', () => {
    authClient.start();
    expect(mockServer.listen).toHaveBeenCalledWith('3000', expect.any(Function));
  });

  it('Handle /validate-token request', () => {
    const req = new http.IncomingMessage(null as unknown as Socket);
    const res = new http.ServerResponse(req);
    req.method = 'POST';
    req.url = '/validate-token';

    const token = 'test-token';
    const requestBody = JSON.stringify({ token });

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

    authClient.handleRequest(req, res);

    onDataCallback(requestBody);
    onEndCallback();

    expect(mockJWTClient.verifyToken).toHaveBeenCalledWith(expect.objectContaining({ token }), res);
  });

  it('Handle /issue-token request', () => {
    const req = new http.IncomingMessage(null as unknown as Socket);
    const res = new http.ServerResponse(req);
    req.method = 'POST';
    req.url = '/issue-token';

    const userId = 'test-user-id';
    const requestBody = JSON.stringify({ userId });
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

    authClient.handleRequest(req, res);

    onDataCallback(requestBody);
    onEndCallback();

    expect(mockJWTClient.issueToken).toHaveBeenCalledWith(req, res, userId);
  });

  it('Return 404 for unknown routes', () => {
    const req = new http.IncomingMessage(null as unknown as Socket);
    const res = new http.ServerResponse(req);
    req.method = 'GET';
    req.url = '/unknown-route';

    const endSpy = jest.spyOn(res, 'end');

    authClient.handleRequest(req, res);

    expect(res.statusCode).toBe(404);
    expect(endSpy).toHaveBeenCalledWith('Not Found');
  });

  it('Return 500 on request error', () => {
    const req = new http.IncomingMessage(null as unknown as Socket);
    const res = new http.ServerResponse(req);
    req.method = 'POST';
    req.url = '/validate-token';

    const endSpy = jest.spyOn(res, 'end');

    const onErrorCallback = jest.fn();

    req.on = jest.fn((event, callback) => {
      onErrorCallback.mockImplementation(callback);
      return req;
    });

    authClient.handleRequest(req, res);

    onErrorCallback(new Error('ERROR SKURWYSYN, ERROR'));

    expect(res.statusCode).toBe(500);
    expect(endSpy).toHaveBeenCalledWith('Internal Server Error');
  });
});