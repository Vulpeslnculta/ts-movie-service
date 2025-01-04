import jwt from 'jsonwebtoken';
import { MongoDBClient } from '@db/db-client';
import http from 'http';


export function userViewPermissions(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (req: http.IncomingMessage, res: http.ServerResponse, ...args: unknown[]) {
    try {
      if (req.url?.startsWith("/movie")) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        const auth = authHeader.split(' ')[1];
        console.log('auth:', auth);

        const decodedAuth = jwt.decode(auth) as { user: string } | null;
        if (!decodedAuth) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        const userId = decodedAuth['user'];
        const dbClient = new MongoDBClient("users");
        await dbClient.connect();
        const user = await dbClient.getUserById(userId);
        if (user.requestTimestamps) {
          const oldestTimestamp = user.requestTimestamps[0];
          const newestTimestamp = user.requestTimestamps[user.requestTimestamps.length - 1];
          const currentTimestamp = Date.now();
          const throttlingTime = 1000 * 5 // 5 seconds
          const ttl = 1000 * 60 * 60 * 24 * 30; // 30 days
          if (newestTimestamp > currentTimestamp - throttlingTime) {
            res.statusCode = 429;
            res.end(`Too many requests. Please wait ${throttlingTime / 1000} seconds`);
            return;
          } else
            if (!user.isPremium && user.requestTimestamps.length >= 5 && oldestTimestamp > currentTimestamp - ttl) {
              const oldestDate = new Date(oldestTimestamp);
              res.statusCode = 403;
              res.end(`You have reached your monthly quota. Please come back on ${oldestDate.toDateString()}`);
              return;
            } else if (oldestTimestamp < currentTimestamp - ttl) {
              user.requestTimestamps.shift();
            }
        }
        if (!user.requestTimestamps) {
          user.requestTimestamps = [];
        }
        user.requestTimestamps!.push(Date.now());

        await dbClient.updateUser(userId, user);
        return await originalMethod.apply(this, [req, res, ...args]);
      } else {
        return await originalMethod.apply(this, [req, res, ...args]);
      }
    } catch (error) {
      console.error('Error in permissions decorator:', error);
      res.statusCode = 403;
      res.end("Forbidden");
    }
  };

  return descriptor;
}