import jwt from 'jsonwebtoken';
import { userViewPermissions } from '../user-view-permissions';
import { MongoDBClient } from '@db/db-client';
import http from 'http';


jest.mock('jsonwebtoken');
jest.mock('@db/db-client');

describe('userViewPermissions', () => {
  let req: http.IncomingMessage;
  let res: http.ServerResponse;
  let descriptor: PropertyDescriptor;
  let originalMethod: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token'
      },
      url: '/movie'
    } as unknown as http.IncomingMessage;

    res = {
      statusCode: 200,
      end: jest.fn()
    } as unknown as http.ServerResponse;

    descriptor = {
      value: originalMethod
    };
    originalMethod = jest.fn();
  });

  it('Return 403 if there is an error in the decorator', async () => {
    (jwt.decode as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });
    userViewPermissions({}, 'test', descriptor);
    await descriptor.value(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.end).toHaveBeenCalledWith('Forbidden');
  });

  it('Return 403 if authorization header is missing', async () => {
    req.headers.authorization = '';
    userViewPermissions({}, 'test', descriptor);
    await descriptor.value(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.end).toHaveBeenCalledWith('Forbidden');
  });

  it('Return 403 if token is invalid', async () => {
    (jwt.decode as jest.Mock).mockReturnValue(null);
    userViewPermissions({}, 'test', descriptor);
    await descriptor.value(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.end).toHaveBeenCalledWith('Forbidden');
  });

  it('Return 429 if too many requests are made', async () => {
    const user = {
      requestTimestamps: [Date.now()],
      isPremium: false
    };
    (jwt.decode as jest.Mock).mockReturnValue({ user: 'userId' });
    (MongoDBClient.prototype.connect as jest.Mock).mockResolvedValue(undefined);
    (MongoDBClient.prototype.getUserById as jest.Mock).mockResolvedValue(user);
    userViewPermissions({}, 'test', descriptor);
    await descriptor.value(req, res);
    expect(res.statusCode).toBe(429);
    expect(res.end).toHaveBeenCalledWith('Too many requests. Please wait 5 seconds');
  });

  it('Return 403 if monthly quota is reached', async () => {
    const longTimeAgo = Date.now() - 1000 * 60 * 60 * 24 * 29;
    const user = {
      requestTimestamps: [longTimeAgo, longTimeAgo, longTimeAgo, longTimeAgo, longTimeAgo],
      isPremium: false
    };
    (jwt.decode as jest.Mock).mockReturnValue({ user: 'userId' });
    (MongoDBClient.prototype.connect as jest.Mock).mockResolvedValue(undefined);
    (MongoDBClient.prototype.getUserById as jest.Mock).mockResolvedValue(user);
    userViewPermissions({}, 'test', descriptor);
    await descriptor.value(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.end).toHaveBeenCalledWith(expect.stringContaining('You have reached your monthly quota'));
  });

  // it('Call the original method if user has permissions', async () => {
  //   const user = {
  //     requestTimestamps: [],
  //     isPremium: true
  //   };
  //   (jwt.decode as jest.Mock).mockReturnValue({ user: 'userId' });
  //   (MongoDBClient.prototype.connect as jest.Mock).mockResolvedValue(undefined);
  //   (MongoDBClient.prototype.getUserById as jest.Mock).mockResolvedValue(user);
  //   (MongoDBClient.prototype.updateUser as jest.Mock).mockResolvedValue(undefined);
  //   userViewPermissions({}, 'test', descriptor);
  //   await descriptor.value(req, res);
  //   expect(originalMethod).toHaveBeenCalled();
  // });
});