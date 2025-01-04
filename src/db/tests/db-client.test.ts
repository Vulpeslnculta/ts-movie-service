/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ObjectId } from "mongodb";
import { MongoDBClient } from "../db-client";
import { User } from "../../api/types";
import { DbMovie } from "../types/movie";

jest.mock("mongodb");
process.env.MONGO_DB_URI = "test-uri";

describe("MongoDBClient", () => {
  let client: MongoDBClient;
  const mockDb = {
    collection: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
    toArray: jest.fn(),
  };

  beforeAll(() => {
    (MongoClient as any).mockImplementation(() => ({
      connect: jest.fn(),
      close: jest.fn(),
      db: jest.fn(() => mockDb),
    }));
  });

  beforeEach(() => {
    client = new MongoDBClient("test-db");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Connect to the database", async () => {
    await client.connect();
    expect(client.db).toBeDefined();
  });

  it("Throw an error if not connected to the database", async () => {
    await expect(client.getUsers()).rejects.toThrow("Not connected to db");
  });

  describe("Users collection", () => {
    beforeEach(async () => {
      await client.connect();
    });

    it("Get all users", async () => {
      const users: User[] = [{ _id: new ObjectId(), login: "test", password: "test" }] as unknown as User[];
      mockDb.toArray.mockResolvedValue(users);

      const result = await client.getUsers();
      expect(result).toEqual(users);
    });

    it("Get a user by id", async () => {
      const user: User = { _id: new ObjectId(), login: "test", password: "test" } as unknown as User;
      mockDb.findOne.mockResolvedValue(user);

      const result = await client.getUserById(user._id!.toHexString());
      expect(result).toEqual(user);
    });

    it("Get a user by login", async () => {
      const user: User = { _id: new ObjectId(), login: "test", password: "test" } as unknown as User;
      mockDb.findOne.mockResolvedValue(user);

      const result = await client.getUserByLogin(user.login);
      expect(result).toEqual(user);
    });

    it("Add a user", async () => {
      const user: User = { _id: new ObjectId(), login: "test", password: "test" } as unknown as User;
      mockDb.insertOne.mockResolvedValue({ insertedId: user._id });

      const result = await client.addUser(user);
      expect(result.insertedId).toEqual(user._id);
    });

    it("Delete a user", async () => {
      const userId = new ObjectId();
      mockDb.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await client.deleteUser(userId.toHexString());
      expect(result.deletedCount).toEqual(1);
    });

    it("Update a user", async () => {
      const user: User = { _id: new ObjectId(), login: "test", password: "test" } as unknown as User;
      mockDb.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await client.updateUser(user._id!.toHexString(), user);
      expect(result.modifiedCount).toEqual(1);
    });
  });

  describe("Movies collection", () => {
    beforeEach(async () => {
      await client.connect();
    });

    it("Get all movies", async () => {
      const movies: DbMovie[] = [{ _id: new ObjectId(), title: "test movie", year: "2021" }] as unknown as DbMovie[];
      mockDb.toArray.mockResolvedValue(movies);

      const result = await client.getMovies();
      expect(result).toEqual(movies);
    });

    it("Get movie titles", async () => {
      const titles = [{ _id: new ObjectId(), title: "test movie" }];
      mockDb.toArray.mockResolvedValue(titles);

      const result = await client.getTitles();
      expect(result).toEqual(titles);
    });

    it("Get a movie by id", async () => {
      const movie: DbMovie = { _id: new ObjectId(), title: "test movie", year: "2021" } as unknown as DbMovie;
      mockDb.findOne.mockResolvedValue(movie);

      const result = await client.getMovieById(movie._id!.toHexString());
      expect(result).toEqual(movie);
    });

    it("Get a movie by title", async () => {
      const movie: DbMovie = { _id: new ObjectId(), title: "test movie", year: "2021" } as unknown as DbMovie;
      mockDb.findOne.mockResolvedValue(movie);

      const result = await client.getMovieByTitle(movie.title);
      expect(result).toEqual(movie);
    });

    it("Add a movie", async () => {
      const movie: DbMovie = { _id: new ObjectId(), title: "test movie", year: "2021" } as unknown as DbMovie;
      mockDb.insertOne.mockResolvedValue({ insertedId: movie._id });

      const result = await client.addMovie(movie);
      expect(result.insertedId).toEqual(movie._id);
    });

    it("Update a movie", async () => {
      const movie: DbMovie = { _id: new ObjectId(), title: "test movie", year: "2021" } as unknown as DbMovie;
      mockDb.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await client.updateMovie(movie._id!.toHexString(), movie);
      expect(result.modifiedCount).toEqual(1);
    });

    it("Delete a movie", async () => {
      const movieId = new ObjectId();
      mockDb.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await client.deleteMovie(movieId.toHexString());
      expect(result.deletedCount).toEqual(1);
    });
  });
});