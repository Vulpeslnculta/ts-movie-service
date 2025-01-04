// import { Socket } from "net";
import { OMDBClient } from "../omdb-client";
import {
  // OMDBMovie,
  OMDBParams
} from "../types";
import http from "http";

jest.mock("http");
jest.mock("../utils", () => ({
  getFromEnv: jest.fn((key: string) => {
    if (key === "OMDB_API_KEY") return "test_api_key";
    if (key === "OMDB_API_URL") return "http://testapi.com";
  }),
}));

describe("OMDBClient", () => {
  let client: OMDBClient;

  beforeEach(() => {
    client = new OMDBClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with API key and URL from environment variables", () => {
    expect(client["apiKey"]).toBe("test_api_key");
    expect(client["apiUrl"]).toBe("http://testapi.com");
  });

  it("should prepare query parameters correctly", () => {
    const params: OMDBParams = { title: "Inception", year: 2010 };
    client.prepareParams(params);
    expect(client["queryParams"].toString()).toBe("apikey=test_api_key&t=Inception&y=2010");
  });

  it("should handle invalid query parameters gracefully", () => {
    const params: OMDBParams = { xd: "value" } as unknown as OMDBParams;
    client.prepareParams(params);
    expect(client["queryParams"].toString()).toBe("apikey=test_api_key");
  });

  // it("should fetch movie data successfully", async () => {
  //   const params: OMDBParams = { title: "Inception" };
  //   const mockResponse = JSON.stringify({ Title: "Inception", Year: "2010" } as OMDBMovie);

  //   (http.request as jest.Mock).mockImplementation((url, callback) => {
  //     const res = new http.IncomingMessage(null as unknown as Socket);
  //     res.statusCode = 200;
  //     res.headers = { "content-type": "application/json" };
  //     callback(res);
  //     res.emit("data", mockResponse);
  //     res.emit("end");
  //     return {
  //       on: jest.fn(),
  //       end: jest.fn(),
  //     };
  //   });

  //   const movie = await client.getMovie(params);
  //   expect(movie).toEqual({ Title: "Inception", Year: "2010" });
  // });

  it("should handle request errors", async () => {
    const params: OMDBParams = { title: "Inception" };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (http.request as jest.Mock).mockImplementation((url, callback) => {
      return {
        on: jest.fn((event, handler) => {
          if (event === "error") {
            handler(new Error("Request failed"));
          }
        }),
        end: jest.fn(),
      };
    });

    await expect(client.getMovie(params)).rejects.toEqual("problem with request: Request failed");
  });
});