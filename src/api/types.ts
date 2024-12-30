import { ObjectId } from "mongodb/mongodb";

export enum ReturnedValue {
  title = 'title',
  id = 'id',
  actor = 'actor',
  director = 'director',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type User = {
  _id?: ObjectId;
  id: string;
  login: string;
  email: string;
  password: string;
  isPremium: boolean;
}