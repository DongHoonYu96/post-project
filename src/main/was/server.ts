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

interface ServerOptions {
    staticDirectory?: string;
}

class Server {
    private server: net.Server;
    private router?: Router;
    private staticDirectory?: string;

    constructor(options: ServerOptions = {}) {
        this.server = net.createServer(socket => this.handleSocket(socket));
        this.staticDirectory = options.staticDirectory;
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

        try {
            if (this.staticDirectory) {
                const filePath = path.join(this.staticDirectory, req.path);
                const fileStats = await fs.promises.stat(filePath);

                if (fileStats.isFile()) {
                    await this.sendFile(filePath, req, res);
                    return;
                }
            }
            if (!this.router) {
                throw new Error('No router configured');
            }

            await this.router.handle(req, res);
        } catch (error) {
            console.error('Request handling error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    private async sendFile(filePath: string, req : Request,  res: Response): Promise<void> {
        try {
            const stats = await stat(filePath);
            const file = await fs.promises.readFile(filePath);
            const ext = path.extname(filePath).slice(1);
            const mimeType = COMMON_MIME_TYPES[ext] || 'application/octet-stream';
            const maxAge = cachePolicy[ext] || 'public, max-age=3600';
            res.setCacheControl(maxAge)

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

    public use(router: Router): void {
        this.router = router;
    }

    public static(directory: string): void {
        this.staticDirectory = directory;
    }

    public listen(port: number, callback?: () => void): void {
        this.server.listen(port, callback);
    }
}

export { Server };