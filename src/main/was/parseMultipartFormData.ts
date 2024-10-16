import { Request } from './request';
import { Response } from './response';
import * as fs from "node:fs";
import * as path from "node:path";
import {randomUUID} from "node:crypto";
import {POST_IMAGE_PATH} from "../domain/common/const/path.const";

interface ParsedField {
    name: string;
    value: string | Buffer;
    filename?: string;
    contentType?: string;
}

export function parseMultipartFormData(bodyBuffer: Buffer): ParsedField[] {
    const result: ParsedField[] = [];
    let startIndex = 0;
    let endIndex = bodyBuffer.indexOf('\r\n'.charCodeAt(0));
    const boundary = bodyBuffer.slice(startIndex, endIndex).toString();

    startIndex = endIndex + 2; // Move past \r\n

    while (startIndex < bodyBuffer.length) {
        endIndex = bodyBuffer.indexOf(boundary, startIndex);
        if (endIndex === -1) break;

        const partBuffer = bodyBuffer.slice(startIndex, endIndex);
        const field = parsePartBuffer(partBuffer);
        if (field) result.push(field);

        startIndex = endIndex + boundary.length + 2; // Move past boundary and \r\n
    }

    return result;
}

function parsePartBuffer(partBuffer: Buffer): ParsedField | null {
    const headerEndIndex = partBuffer.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) return null;

    const headerStr = partBuffer.slice(0, headerEndIndex).toString();
    const headers = parseHeaders(headerStr);
    const contentStartIndex = headerEndIndex + 4; // Move past \r\n\r\n

    const field: ParsedField = { name: headers.name, value: '' };
    if (headers.filename) {
        field.filename = headers.filename;
        field.contentType = headers.contentType;
        field.value = partBuffer.slice(contentStartIndex);
    } else {
        field.value = partBuffer.slice(contentStartIndex).toString().trim();
    }

    return field;
}

function parseHeaders(headerStr: string): { name: string; filename?: string; contentType?: string } {
    const headers: { name: string; filename?: string; contentType?: string } = { name: '' };
    const lines = headerStr.split('\r\n');

    for (const line of lines) {
        if (line.startsWith('Content-Disposition:')) {
            const nameMatch = line.match(/name="([^"]+)"/);
            if (nameMatch) headers.name = nameMatch[1];

            const filenameMatch = line.match(/filename="([^"]+)"/);
            if (filenameMatch) headers.filename = filenameMatch[1];
        } else if (line.startsWith('Content-Type:')) {
            headers.contentType = line.split(':')[1].trim();
        }
    }

    return headers;
}

export function processMultipartData(parsedFields: ParsedField[], req: Request): void {
    req.body = {};

    for (const field of parsedFields) {
        if (field.filename && field.contentType) {
            // This is a file
            req.file = {
                fieldname: field.name,
                originalname: field.filename,
                encoding: 'binary', // 바이너리 데이터이므로 'binary'로 설정
                mimetype: field.contentType,
                buffer: field.value instanceof Buffer ? field.value : Buffer.from(field.value, 'binary')
            };
        } else {
            // This is a text field
            req.body[field.name] = field.value.toString();
        }
    }
}

export async function saveUploadedImage(req: Request): Promise<string | null> {
    if (!req.file) {
        console.error('No file uploaded');
        return null;
    }

    const uploadDir = POST_IMAGE_PATH;

    // 업로드 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 파일 확장자 추출
    const fileExt = path.extname(req.file.originalname);

    // UUID를 사용하여 고유한 파일 이름 생성
    const fileName = `${randomUUID()}${fileExt}`;

    const filePath = path.join(uploadDir, fileName);

    try {
        // 파일 저장
        // 파일 저장 (바이너리 모드 사용)
        await fs.promises.writeFile(filePath, req.file.buffer, { flag: 'wx' });
        console.log(`File saved successfully: ${filePath}`);
        return fileName; // 저장된 파일 이름 반환
    } catch (error) {
        console.error('Error saving file:', error);
        return null;
    }
}
