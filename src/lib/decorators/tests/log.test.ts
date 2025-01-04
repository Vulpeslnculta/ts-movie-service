import { log } from '../log';
import http from 'http';

describe('log decorator', () => {
  let consoleSpy: jest.SpyInstance;
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    req = { url: '/test-url', method: 'GET' } as http.IncomingMessage;
    res = {} as http.ServerResponse;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Log request URL and method', () => {
    class TestClass {
      @log
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      testMethod(req: http.IncomingMessage, res: http.ServerResponse) {
        return 'test';
      }
    }

    const instance = new TestClass();
    instance.testMethod(req, res);

    expect(consoleSpy).toHaveBeenCalledWith('Request URL: /test-url');
    expect(consoleSpy).toHaveBeenCalledWith('Request Method: GET');
  });

  it('Call the original method', () => {
    const originalMethod = jest.fn().mockReturnValue('original method called');

    class TestClass {
      @log
      testMethod(req: http.IncomingMessage, res: http.ServerResponse) {
        return originalMethod(req, res);
      }
    }

    const instance = new TestClass();
    const result = instance.testMethod(req, res);

    expect(result).toBe('original method called');
    expect(originalMethod).toHaveBeenCalledWith(req, res);
  });
});