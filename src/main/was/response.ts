import { Socket } from 'net';
import { statusCode, HTTP_VERSIONS } from './const/httpConsts';

type StatusCode = keyof typeof statusCode;
type Headers = { [key: string]: string };

class Response {
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

export { Response };