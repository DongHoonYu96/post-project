import { Socket } from 'net';
import {statusCode, HTTP_VERSIONS, COMMON_MIME_TYPES, cachePolicy} from './const/httpConsts';
import {stat} from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import {createHash} from "node:crypto";
import {Request} from "../was/request";

type StatusCode = keyof typeof statusCode;
type Headers = { [key: string]: string };

export class Response {
    private socket: Socket;
    private headers: Headers;
    private statusCode: StatusCode;
    private statusMessage: string;
    private body: string | Buffer;

    constructor(socket: Socket) {
        this.socket = socket;
        this.headers = {};
        this.statusCode = 200;
        this.statusMessage = 'OK';
        this.body = '';
    }

    public status(code: StatusCode): this {
        this.statusCode = code;
        this.statusMessage = statusCode[code];
        return this;
    }

    public header(key: string, value: string): this {
        this.headers[key] = value;
        return this;
    }

    public setCacheControl(value: string): this {
        this.header('Cache-Control', `public, max-age=${value}`);
        return this;
    }

    /**
     * 요청을 처리하고 적절한 뷰를 렌더링합니다.
     * @param req Request 객체
     * @param res Response 객체
     */
    public async forward(req: Request, res: Response, viewPath : string): Promise<void> {
        try {
            const stats = await stat(viewPath);
            const file = await fs.promises.readFile(viewPath);
            const ext = path.extname(viewPath).slice(1);
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

    public render(data: string | Buffer, mimeType?: string): void {
        if (mimeType) {
            this.header('Content-Type', mimeType);
        }
        this.body = data;
        this.send();
    }

    public send(body?: string | Buffer): void {
        if (body !== undefined) {
            this.body = body;
        }

        if (!this.headers['Content-Type']) {
            this.header('Content-Type', this.getDefaultContentType());
        }

        this.header('Content-Length', Buffer.byteLength(this.body).toString());

        this.writeHead();
        this.writeBody();
        this.socket.end();
    }

    private writeHead(): void {
        this.socket.write(`${HTTP_VERSIONS.HTTP_1_1} ${this.statusCode} ${this.statusMessage}\r\n`);
        Object.entries(this.headers).forEach(([key, value]) => {
            this.socket.write(`${key}: ${value}\r\n`);
        });
        this.socket.write('\r\n');
    }

    private writeBody(): void {
        if (this.body) {
            this.socket.write(this.body);
        }
    }

    private getDefaultContentType(): string {
        return Buffer.isBuffer(this.body) ? 'application/octet-stream' : 'text/plain';
    }
}
