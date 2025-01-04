import { getFromEnv } from "./utils";
import { OMDBMovie, OMDBParams, OMDBQueryParams } from "./types";
import http from "http";

export class OMDBClient {
  private apiKey: string;
  private apiUrl: string;
  private queryParams: URLSearchParams;

  constructor() {
    this.apiKey = getFromEnv('OMDB_API_KEY');
    this.apiUrl = getFromEnv('OMDB_API_URL');
    this.queryParams = new URLSearchParams();
  }

  prepareParams(params: OMDBParams) {
    this.queryParams.append('apikey', this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        try {
          const formattedKey = OMDBQueryParams[key as keyof typeof OMDBQueryParams];
          if (formattedKey) {
            this.queryParams.append(formattedKey, value.toString());
          } else {
            console.error(`Invalid query param: ${key}`);
          }
        } catch (e) {
          console.error(`Error: ${e}`);
          console.error(`Invalid query param: ${key}`);
        }
      }
    }
  }

  async getMovie(params: OMDBParams): Promise<OMDBMovie> {
    this.prepareParams(params);
    return new Promise((resolve, reject) => {
      console.log(`${this.apiUrl}/?${this.queryParams}`);
      const request = http.request(`${this.apiUrl}/?${this.queryParams}`, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk: OMDBMovie) => {
          data += chunk;
        });
        apiRes.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      request.on('error', (e) => {
        reject(`problem with request: ${e.message}`);
      });

      request.end();
    });
  }
}