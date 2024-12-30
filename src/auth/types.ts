import http from 'http';

export type RequestWithToken = http.IncomingMessage & { token: string };