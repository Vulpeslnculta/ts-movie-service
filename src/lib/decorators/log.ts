import http from 'http';

//eslint-disable-next-line
export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  //eslint-disable-next-line
  descriptor.value = function (req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) {
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);
    return originalMethod.apply(this, [req, res, ...args]);
  };

  return descriptor;
}