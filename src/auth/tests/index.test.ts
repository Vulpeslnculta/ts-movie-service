import { authApi } from '../index';
import { AuthClient } from '@auth/auth-client';

jest.mock('@auth/auth-client');

describe('authApi', () => {
  let mockStart: jest.Mock;

  beforeEach(() => {
    mockStart = jest.fn();
    (AuthClient as jest.Mock).mockImplementation(() => {
      return {
        start: mockStart
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create an AuthClient with the correct port and start it', () => {
    process.env.PORT = '3000';
    authApi();
    expect(AuthClient).toHaveBeenCalledWith('3000');
    expect(mockStart).toHaveBeenCalled();
  });

  it('Use default port 8080 if PORT is not defined', () => {
    delete process.env.PORT;
    authApi();
    expect(AuthClient).toHaveBeenCalledWith('8080');
    expect(mockStart).toHaveBeenCalled();
  });
});