import { stringToHash } from '@lib/utils';
import { MongoDBClient } from '@db/db-client';
import { v4 } from 'uuid';
import http from 'http';
export async function login(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('login');
  try {
    const dbClient = new MongoDBClient("users");
    await dbClient.connect();
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { login, password } = JSON.parse(body);
        if (!login || !password) {
          res.statusCode = 400;
          res.end("Bad Request");
          return;
        }
        const hashedPassword = stringToHash(password);
        const user = await dbClient.getUserByLogin(login);
        console.log(user);
        if (!user) {
          res.statusCode = 404;
          res.end("User not found, check your login or register");
          return;
        }
        if (user.password !== hashedPassword) {
          res.statusCode = 401;
          res.end("Unauthorized");
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const authReq = http.request({
          hostname: 'auth',
          port: 8080,
          path: '/issue-token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }, (authRes) => {
          let data = '';
          authRes.on('data', (chunk) => {
            data += chunk;
          });
          authRes.on('end', () => {
            res.end(data);
          });
        }
        )
        authReq.write(JSON.stringify({ userId: user._id }));
        authReq.end();
      } catch (error) {
        console.error(`Error while login: ${error}`);
        res.statusCode = 400;
        res.end("Bad Request");
      }
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export async function register(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("users");
    await dbClient.connect();
    req.on('data', async (data) => {
      try {
        const { login, password, email } = JSON.parse(data.toString());
        const hashedPassword = stringToHash(password);
        const user = await dbClient.getUserByLogin(login);
        if (user) {
          res.statusCode = 409;
          res.end("User already exists");
          return;
        }
        await dbClient.addUser(
          {
            login: login.toLowerCase(),
            password: hashedPassword,
            id: v4(),
            email: email.toLowerCase(),
            isPremium: false
          }
        );
      } catch (error) {
        console.error(`Error while register: ${error}`);
        res.statusCode = 400;
        res.end("Bad Request");
      }
      res.end("User created");
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export async function changePremium(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("users");
    await dbClient.connect();
    req.on('data', async (data) => {
      try {
        const { login, isPremium } = JSON.parse(data.toString());
        const user = await dbClient.getUserByLogin(login);
        if (!user) {
          res.statusCode = 404;
          res.end("User not found");
          return;
        }
        user.isPremium = isPremium === 'true' ? true : false;
        console.log(`user before update: ${JSON.stringify(user)}`);
        await dbClient.updateUser(user._id!.toHexString(), user);
      } catch (error) {
        console.error(`Error while changePremium: ${error}`);
        res.statusCode = 400;
        res.end("Bad Request");
      }
      console.log('Data:', data.toString());
      res.end('Hello, World!');
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
export async function deleteUser(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("users");
    await dbClient.connect();
    req.on('data', async (data) => {
      try {
        const { login } = JSON.parse(data.toString());
        const user = await dbClient.getUserByLogin(login);
        if (!user) {
          res.statusCode = 404;
          res.end("User not found");
          return;
        }
        await dbClient.deleteUser(user._id!.toHexString());
      } catch (error) {
        console.error(`Error while deleteUser: ${error}`);
        res.statusCode = 400;
        res.end("Bad Request");
      }
      res.end('Hello, World!');
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export async function getAllUsers(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const dbClient = new MongoDBClient("users");
    await dbClient.connect();
    const users = await dbClient.getUsers();
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}