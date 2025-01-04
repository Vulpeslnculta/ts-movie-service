import * as http from 'http';
import { validateToken } from '../validate-token';
import { getFromEnv } from '../../utils';
// import { Socket } from 'net';

jest.mock('jsonwebtoken');
jest.mock('../../utils');
jest.mock('http', () => {
  const originalHttp = jest.requireActual('http');
  return {
    ...originalHttp,
    request: jest.fn(),
  };
});

describe('validateToken', () => {
  let req: http.IncomingMessage;
  let res: http.ServerResponse;
  let originalMethod: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      url: '/some-path',
    } as http.IncomingMessage;

    res = {
      statusCode: 200,
      end: jest.fn(),
    } as unknown as http.ServerResponse;

    originalMethod = jest.fn();
    (getFromEnv as jest.Mock).mockReturnValue('http://auth-api-url'); // Mock the return value
  });

  it('should call original method for /auth/login path', () => {
    req.url = '/auth/login';
    const descriptor = {
      value: originalMethod,
    };

    validateToken({}, 'testMethod', descriptor);
    descriptor.value(req, res);

    expect(originalMethod).toHaveBeenCalledWith(req, res);
  });

  it('should call original method for /auth/register path', () => {
    req.url = '/auth/register';
    const descriptor = {
      value: originalMethod,
    };

    validateToken({}, 'testMethod', descriptor);
    descriptor.value(req, res);

    expect(originalMethod).toHaveBeenCalledWith(req, res);
  });

  it('should respond with 403 if authorization header is missing', () => {
    const descriptor = {
      value: originalMethod,
    };

    validateToken({}, 'testMethod', descriptor);
    descriptor.value(req, res);

    expect(res.statusCode).toBe(403);
    expect(res.end).toHaveBeenCalledWith('Forbidden');
  });

  // it('should respond with 401 if token validation fails', async () => {
  //   req.headers['authorization'] = 'Bearer invalid-token';
  //   const descriptor = {
  //     value: originalMethod,
  //   };

  //   (http.request as jest.Mock).mockImplementation((options, callback) => {
  //     const authRes = new http.IncomingMessage(null as unknown as Socket);
  //     authRes.statusCode = 401;
  //     callback(authRes);
  //     return {
  //       on: (event: string, callback: () => void) => {
  //         console.log(`Event triggered: ${event}`);
  //         jest.fn()(event, callback);
  //       },
  //       write: jest.fn(),
  //       end: jest.fn(),
  //     };
  //   });

  //   validateToken({}, 'testMethod', descriptor);
  //   await descriptor.value(req, res);

  //   expect(res.statusCode).toBe(401);
  //   expect(res.end).toHaveBeenCalledWith('Unauthorized');
  // });

  it('should respond with 500 if there is an error during token validation', () => {
    req.headers['authorization'] = 'Bearer valid-token';
    const descriptor = {
      value: originalMethod,
    };

    (http.request as jest.Mock).mockImplementation(() => {
      return {
        on: (event: string, callback: (arg0: Error) => void) => {
          if (event === 'error') {
            callback(new Error('Validation error'));
          }
        },
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    validateToken({}, 'testMethod', descriptor);
    descriptor.value(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });

  // it('should call original method if token validation succeeds', () => {
  //   req.headers['authorization'] = 'Bearer valid-token';
  //   const descriptor = {
  //     value: originalMethod,
  //   };

  //   (http.request as jest.Mock).mockImplementation((options, callback) => {
  //     const authRes = new http.IncomingMessage(null as unknown as Socket);
  //     authRes.statusCode = 200;
  //     callback(authRes);
  //     return {
  //       on: jest.fn(),
  //       write: jest.fn(),
  //       end: jest.fn(),
  //     };
  //   });

  //   validateToken({}, 'testMethod', descriptor);
  //   descriptor.value(req, res);

  //   expect(originalMethod).toHaveBeenCalledWith(req, res);
  // });

  it('should respond with 500 if there is an error during token validation', () => {
    req.headers['authorization'] = 'Bearer valid-token';
    const descriptor = {
      value: originalMethod,
    };

    (http.request as jest.Mock).mockImplementation(() => {
      return {
        on: (event: string, callback: (arg0: Error) => void) => {
          if (event === 'error') {
            callback(new Error('Validation error'));
          }
        },
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    validateToken({}, 'testMethod', descriptor);
    descriptor.value(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });
});