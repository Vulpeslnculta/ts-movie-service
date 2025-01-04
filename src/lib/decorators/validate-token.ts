import * as http from 'http';
import { URL } from 'url';
import { getFromEnv } from '../utils';


//eslint-disable-next-line
export function validateToken(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const authApiUrl = getFromEnv("AUTH_API_URL");
  const originalMethod = descriptor.value;

  //eslint-disable-next-line
  descriptor.value = function (req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    if (url.pathname === "/auth/login" || url.pathname === "/auth/register") {
      return originalMethod.apply(this, [req, res, ...args]);
    }

    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];

      // Call auth API to validate token
      console.log(authApiUrl);
      const options = {
        hostname: new URL(authApiUrl).hostname,
        port: new URL(authApiUrl).port,
        path: '/validate-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const authReq = http.request(options, (authRes) => {
        console.log(`Auth API response: ${authRes.statusCode}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let data = '';
        authRes.on('data', (chunk) => {
          data += chunk;
        });

        authRes.on('end', () => {
          if (authRes.statusCode === 200) {
            return originalMethod.apply(this, [req, res, ...args]);
          } else {
            res.statusCode = 401;
            res.end("Unauthorized");
            return;
          }
        });
      });

      authReq.on('error', (e) => {
        console.error(`Error while validating token: ${e}`);
        res.statusCode = 500;
        res.end("Internal Server Error");
        return;
      });

      authReq.write(JSON.stringify({ token }));
      authReq.end();
    } else {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }
  };

  return descriptor;
}