// http-constants.ts

export const CRLF = '\r\n';

export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS',
    HEAD: 'HEAD',
} as const;

export type HttpMethod = keyof typeof HTTP_METHODS;

export const HTTP_VERSIONS = {
    HTTP_1_0: 'HTTP/1.0',
    HTTP_1_1: 'HTTP/1.1',
    HTTP_2_0: 'HTTP/2.0',
} as const;

export type HttpVersion = typeof HTTP_VERSIONS[keyof typeof HTTP_VERSIONS];

export const COMMON_MIME_TYPES = {
    'html': 'text/html',
    'txt': 'text/plain',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
} as const;

export const COMMON_HEADERS = {
    CONTENT_TYPE: 'Content-Type',
    CONTENT_LENGTH: 'Content-Length',
    USER_AGENT: 'User-Agent',
    HOST: 'Host',
    ACCEPT: 'Accept',
    AUTHORIZATION: 'Authorization',
    COOKIE: 'Cookie',
} as const;

export const statusCode = {
    200: 'OK',
    201: 'CREATED',
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    500: 'INTERNAL_SERVER_ERROR',
} as const;