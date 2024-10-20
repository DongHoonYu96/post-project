import { parse as parseUrl, UrlWithParsedQuery } from 'url';
import { CRLF } from './const/httpConsts';
import {Member} from "../domain/member/Member";

interface ParsedRequest {
    httpVersion: string;
    method: string;
    path: string;
    query: { [key: string]: string | string[] };
    headers: Map<string, string>;
    body: any;
    file: any;
    user : Member;
}

class Request implements ParsedRequest {
    public httpVersion: string;
    public method: string;
    public path: string;
    public query: { [key: string]: string | string[] };
    public headers: Map<string, string>;
    public body: any;
    public file: any;
    public Cookie : any;
    public cookies : any;
    public isEnd : boolean;
    public rawBody: Buffer;
    public user : Member;

    constructor(rawHeaders: string, rawBody: Buffer) {
        this.rawBody = rawBody;
        this.parseRequest(rawHeaders);
        this.parseBody();
    }

    private parseRequest(rawHeaders: string): void {
        /**
         * const rawHeaders = `POST /upload-image HTTP/1.1\r\nHost: localhost:3000\r\nConnection: keep-alive\r\nContent-Length: 12548`;
         */
        const [mainLine, ...headerLines] = rawHeaders.split(CRLF);
        let [method, path, httpVersion] = mainLine.split(' ');

        // console.log("rawHeaders: " + rawHeaders);

        // method, path, httpVersion이 존재하는지 확인
        // if (!path) {
        //     path = '/image-upload';
        // }
        const parsedUrl = parseUrl(path as string, true) as UrlWithParsedQuery;


        this.httpVersion = httpVersion;
        this.method = method;
        this.path = parsedUrl.pathname || '/';
        this.query = parsedUrl.query;
        this.headers = new Map(
            headerLines.map(line => {
                const [key, value] = line.split(': ');
                return [key.toLowerCase(), value];
            })
        );
    }

    private parseBody(): void {
        const contentType = this.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
            try {
                this.body = JSON.parse(this.rawBody.toString());
            } catch (error) {
                console.error('Error parsing JSON body:', error);
                this.body = {};
            }
        } else if (contentType?.includes('application/x-www-form-urlencoded')) {
            this.body = Object.fromEntries(new URLSearchParams(this.rawBody.toString()));
        } else {
            this.body = this.rawBody.toString();
        }
    }

    public get(headerName: string): string | undefined {
        return this.headers.get(headerName.toLowerCase());
    }

    public is(type: string): boolean {
        const contentType = this.get('content-type');
        return contentType ? contentType.includes(type) : false;
    }
}

export { Request };