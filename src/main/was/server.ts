import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import { Request } from './request';
import { Response } from './response';
import {cachePolicy, CRLF} from './const/httpConsts';
import { COMMON_MIME_TYPES } from './const/httpConsts';
import { Router } from './router';
import {createHash} from "node:crypto"; // 라우터 타입을 위해 추가
import { stat } from 'fs/promises';
import {FrontControllerServletV5} from "../frontcontroller/v5/FrontControllerServletV5";
import {staticServe} from "../middlewares/middlewares";

/**
 * Represents an HTTP request handler function.
 */
type RequestHandler = (req: Request, res: Response, next: (err?: Error) => void) => void;

/**
 * Represents an error handling middleware function.
 */
type ErrorHandler = (err: Error, req: Request, res: Response, next: (err?: Error) => void) => void;

/**
 * Represents a middleware function, which can be either a RequestHandler or an ErrorHandler.
 */
type Middleware = RequestHandler | ErrorHandler;

interface ServerOptions {
    staticDirectory?: string;
}

class Server {
    private server: net.Server;
    private router?: Router;
    private staticDirectory?: string;
    private middlewares: Middleware[] = [];

    constructor(options: ServerOptions = {}) {
        this.server = net.createServer(socket => this.handleSocket(socket));
        this.staticDirectory = options.staticDirectory;
    }
    /**
     * Handles incoming HTTP requests by running them through the middleware chain.
     * @param req - The incoming HTTP request.
     * @param res - The HTTP response object.
     */

    /**
     * Recursively runs through the middleware chain.
     * @param middlewares - The array of middleware functions.
     * @param index - The current index in the middleware array.
     * @param err - An error object, if any.
     * @param req - The incoming HTTP request.
     * @param res - The HTTP response object.
     */
    private runMiddleware(
        middlewares: Middleware[],
        index: number,
        err: Error | null,
        req: Request,
        res: Response,
    ): void {
        if (index < 0 || index >= middlewares.length) return;

        const nextMiddleware = middlewares[index];
        const next = (e?: Error) => this.runMiddleware(middlewares, index + 1, e || null, req, res);

        if (err) {
            // 에러가 있고, 다음에 실행할 미들웨어가 에러 처리기인경우 에러처리 미들웨어 실행
            if (this.isErrorHandler(nextMiddleware)) {
                (nextMiddleware as ErrorHandler)(err, req, res, next);
            } else {
                // 에러가 있고, 다음에 실행할 미들웨어가 에러 처리기가 아니면 그 다음 미들웨어를 찾는다
                this.runMiddleware(middlewares, index + 1, err, req, res);
            }
        } else {
            /**
             * as로 타입강제지정, 등록된 함수 실행
             * 아래코드와 같은기능
             * if (this.isRequestHandler(nextMiddleware)) {
             *     nextMiddleware(req, res, next);
             */
            (nextMiddleware as RequestHandler)(req, res, next);

        }
    }

    /**
     * Checks if a middleware function is an error handler.
     * @param middleware - The middleware function to check.
     * @returns True if the middleware is an error handler, false otherwise.
     */
    private isErrorHandler(middleware: Middleware): middleware is ErrorHandler {
        return middleware.length === 4;
    }

    /**
     * Adds a middleware function to the application.
     * @param middleware - The middleware function to add.
     */
    public use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    private handleSocket(socket: net.Socket): void {
        let bufferedData = Buffer.alloc(0);
        let contentLength = 0;
        let headers = '';

        socket.on('data', (data: Buffer) => {
            [bufferedData, headers, contentLength] = this.processData(data, socket, bufferedData, headers, contentLength);
        });

        socket.on('error', (error: Error) => {
            console.error('Socket error:', error);
        });
    }

    private processData(
        data: Buffer,
        socket: net.Socket,
        bufferedData: Buffer,
        headers: string,
        contentLength: number
    ): [Buffer, string, number] {
        const dataStr = data.toString();
        const headerEndIndex = dataStr.indexOf(CRLF + CRLF);

        if (headerEndIndex !== -1) {
            headers = dataStr.slice(0, headerEndIndex);
            contentLength = this.getContentLength(headers);
            bufferedData = Buffer.concat([bufferedData, data.slice(headerEndIndex + CRLF.length * 2)]);
        } else {
            bufferedData = Buffer.concat([bufferedData, data]);
        }

        if (bufferedData.length >= contentLength) {
            this.handleRequest(headers, bufferedData.slice(0, contentLength), socket);
            bufferedData = bufferedData.slice(contentLength);
        }

        return [bufferedData, headers, contentLength];
    }

    private getContentLength(headers: string): number {
        const contentLengthLine = headers.split(CRLF).find(value => value.toLowerCase().startsWith('content-length:'));
        return contentLengthLine ? Number(contentLengthLine.split(':')[1].trim()) : 0;
    }

    private async handleRequest(headers: string, body: Buffer, socket: net.Socket): Promise<void> {
        const req = new Request(headers, body);
        const res = new Response(socket);

        this.runMiddleware(this.middlewares, 0, null, req, res);

        const isServed = await staticServe(req,res);
        if(isServed) return;

        const frontControllerServletV5 = new FrontControllerServletV5();
        frontControllerServletV5.service(req,res);

        //todo : 404 Not Found
    }

    private async sendFile(filePath: string, req : Request,  res: Response): Promise<void> {
        try {
            const stats = await stat(filePath); //날짜읽어오기
            const file = await fs.promises.readFile(filePath);
            const ext = path.extname(filePath).slice(1);
            const mimeType = COMMON_MIME_TYPES[ext] || 'application/octet-stream';
            const maxAge = cachePolicy[ext] || 'public, max-age=3600';
            res.setCacheControl(maxAge);

            // ETag 생성
            const etag : string = createHash('md5').update(file).digest('hex');

            // Cache-Control, ETag, Last-Modified 설정
            res.header('ETag', `${etag}`)
                .header('Last-Modified', stats.mtime.toUTCString());

            // 조건부 요청 처리
            if (req.headers.get('if-none-match') === etag) {
                res.header('Content-Type', mimeType).status(304).send();
                return;
            }

            // 내용이 바뀐경우에만, 새로운 body를 보내준다.
            res.render(file,mimeType);

        } catch (error) {
            console.error('File read error:', error);
            res.status(404).send('File Not Found');
        }
    }

    public static(directory: string): void {
        this.staticDirectory = directory;
    }

    public listen(port: number, callback?: () => void): void {
        this.server.listen(port, callback);
    }
}

export { Server };