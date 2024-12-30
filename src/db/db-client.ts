import { Db, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { getFromEnv } from "../lib/utils";
import { DbMovie } from "./types/movie";
import { User } from "../api/types";

export class MongoDBClient {

  url: string;

  client: MongoClient;

  dbName: string;

  db?: Db;

  constructor(dbName?: string) {
    this.url = getFromEnv('MONGO_DB_URI');
    this.dbName = dbName ? dbName : getFromEnv('MONGO_DB');
    this.client = new MongoClient(this.url, { serverApi: ServerApiVersion.v1 });
  }
  async connect() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    if (!this.db) {
      throw new Error('Not connected to db');
    }
  }
  async disconnect() {
    await this.client.close();
  }
  // #region users collection
  async getUsers(): Promise<User[]> {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('users').find().toArray() as unknown as Promise<User[]>;
  }

  async getUserByLogin(login: string): Promise<User> {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('users').findOne({
      login
    }) as unknown as Promise<User>;
  }

  async addUser(user: User) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('users').insertOne(user);
  }

  async deleteUser(id: ObjectId) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('users').deleteOne({ _id: new ObjectId(id) });
  }

  async updateUser(id: ObjectId, user: User) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: user });
  }
  // #endregion users collection

  // #region movies collection
  async getMovies(): Promise<DbMovie[]> {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').find().toArray() as unknown as Promise<DbMovie[]>
  }

  async getTitles() {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').find({}, { projection: { title: 1, _id: 1 } }).toArray() as unknown as Promise<DbMovie[]>;
  }

  async getMovieById(id: ObjectId) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').findOne({ _id: new ObjectId(id) });
  }

  async getMovieByTitle(title: string) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').findOne({
      title
    });
  }
  async addMovie(movie: DbMovie) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').insertOne(movie);
  }

  async updateMovie(id: ObjectId, movie: DbMovie) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').updateOne({ _id: new ObjectId(id) }, { $set: movie });
  }

  async deleteMovie(id: ObjectId) {
    if (!this.db) {
      throw new Error('Not connected to db');
    }
    return this.db.collection('movies').deleteOne({ _id: new ObjectId(id) });
  }
  // #endregion movies collection
}