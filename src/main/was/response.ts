import { Socket } from 'net';
import {statusCode, HTTP_VERSIONS, COMMON_MIME_TYPES, cachePolicy, PROTOCOL} from './const/httpConsts';
import {stat} from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import {createHash} from "node:crypto";
import {Request} from "../was/request";
import * as ejs from 'ejs';

type StatusCode = keyof typeof statusCode;
type Headers = { [key: string]: string };

export class Response {
    private socket: Socket;
    private headers: Headers;
    private statusCode: StatusCode;
    private statusMessage: string;
    private body: string | Buffer;
    private req : Request;

    constructor(socket: Socket ,req: Request) {
        this.socket = socket;
        this.headers = {};
        this.statusCode = 200;
        this.statusMessage = 'OK';
        this.body = '';
        this.req=req;
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

    changeExtensionToEjs(filePath: string): string {
        // 디렉토리 경로와 파일 이름(확장자 포함)을 분리합니다.
        const dir = path.dirname(filePath);
        const file = path.basename(filePath);

        // 파일 이름에서 확장자를 제외한 부분을 추출합니다.
        const name = path.basename(file, path.extname(file));

        // 새로운 파일 경로를 생성합니다.
        return path.join(dir, `${name}.ejs`);
    }

    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async forwardEjs(req: Request, res: Response, viewPath : string, pageData): Promise<void> {
        try {
            /**
             * 기본값 : 이전 로직에서 모두 .html로 간주하고 보냈음.
             * 존재하지않는 파일인경우, 확장자를 ejs로 바꿈 && 동적렌더링.
             */
            const isNotExist = !await this.fileExists(viewPath);
            if(isNotExist){
                viewPath = this.changeExtensionToEjs(viewPath);
            }

            const stats = await stat(viewPath);
            const file = await fs.promises.readFile(viewPath);
            const ext = path.extname(viewPath).slice(1);
            const mimeType = COMMON_MIME_TYPES[ext] || 'application/octet-stream';
            const maxAge = cachePolicy[ext] || 'public, max-age=3600';
            // res.setCacheControl(maxAge);

            const renderedHtml = await this.renderEjsTemplate(viewPath, pageData);

            if(isNotExist) {
                const renderedHtml = await this.renderEjsTemplate(viewPath, pageData);
                res.render(renderedHtml, mimeType);
            }
            else{
                res.render(file, mimeType);
            }

            // 내용이 바뀐경우에만, 새로운 body를 보내준다.
            // res.render(renderedHtml, mimeType);

        } catch (error) {
            console.error('File read error:', error);
            res.status(404).send('File Not Found');
        }
    }

    async renderEjsTemplate(templatePath: string, data:any): Promise<string> {
        // 템플릿 파일 읽기
        const template =await fs.promises.readFile(templatePath, 'utf-8');

        // EJS를 사용하여 템플릿 렌더링
        const html = ejs.render(template, data, {
            filename: templatePath // 이를 통해 include 기능 등을 사용할 수 있습니다.
        });

        return html;
    }


    public render(data: string | Buffer, mimeType?: string): void {
        if (mimeType) {
            this.header('Content-Type', mimeType);
        }
        this.body = data;
        this.send();
    }

    public cookie(name:string, uuid : string) : this {
        this.header("Set-Cookie",name+"="+uuid+"; "+"path=/");
        return this;
    }

    public redirect(path: string) {
        if(!path.startsWith('/')){
            path = '/'+path;
        }
        // 절대 URL인 경우 그대로 사용
        if (path.startsWith('http://') || path.startsWith('https://')) {
            this.header("Location", path);
        } else {
            // 상대 경로인 경우, 현재 호스트를 기반으로 URL 구성
            const host = this.req.headers.get('host');
            const fullUrl = `${PROTOCOL.HTTP}://${host}${path}`;
            this.header("Location", fullUrl);
        }
        this.send();
    }

    public redirectGithub(path: string) {
        this.status(302).header("Location", path).send();
    }

    // public json(data: any): void {
    //     try {
    //         const jsonString = JSON.stringify(data);
    //
    //         this.header('Content-Type', 'application/json');
    //         this.header('Content-Length', Buffer.byteLength(jsonString).toString());
    //         this.writeHead();
    //
    //         const response = `\r\n${jsonString}`;
    //
    //         this.socket.write(response, 'utf8', (err) => {
    //             if (err) {
    //                 console.error('Error sending response:', err);
    //             }
    //             this.socket.end();
    //         });
    //     } catch (error) {
    //         console.error('Error in json method:', error);
    //         this.status(500).send('Internal Server Error');
    //     }
    // }

    public json(data: any): void {
        try {
            const jsonString = JSON.stringify(data); //일반객체 -> json

            this.header('Content-Type', 'application/json');
            this.header('Content-Length', Buffer.byteLength(jsonString).toString());
            this.writeHead();

            const response = `\r\n${jsonString}`;

            this.socket.write(response, 'utf8', (err) => {
                if (err) {
                    console.error('Error sending response:', err);
                }
                this.socket.end();
            });
        } catch (error) {
            console.error('Error in json method:', error);
            this.status(500).send('Internal Server Error');
        }
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
