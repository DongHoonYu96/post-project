import * as fs from 'fs';
import * as path from 'path';
import {POST_IMAGE_PATH} from "../domain/common/const/path.const";
import {randomUUID} from "node:crypto";

export class MultiPartImageExtractor {
    private static CONTENT_TYPE_REGEX = /^Content-Type:\s*(.+)$/i;
    private static FILENAME_REGEX = /filename="(.+)"/i;

    private extractBoundaryAndData(buffer: Buffer): { boundary: string, data: Buffer } | null {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
            console.error('올바른 multipart/form-data 형식이 아닙니다.');
            return null;
        }

        const header = buffer.slice(0, headerEnd).toString('utf8');
        const boundary = header.split('\r\n')[0]

        const data = buffer.slice(headerEnd + 4); // '\r\n\r\n' 이후의 데이터

        return { boundary, data };
    }

    async saveImage(buffer: Buffer): Promise<string | null> {
        const extractedInfo = this.extractBoundaryAndData(buffer);
        if (!extractedInfo) {
            console.error('boundary와 데이터를 추출할 수 없습니다.');
            return null;
        }

        const { boundary, data } = extractedInfo;

        const uploadDir = POST_IMAGE_PATH;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const idx = data.indexOf(boundary)
        const imageData = data.slice(0, idx);

        const uuid = randomUUID();
        const filepath = path.join(uploadDir, uuid+'.png');
        const nextUrl = path.join('public','posts', uuid+'.png');

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, imageData, (err) => {
                if (err) {
                    console.error('파일 저장 중 오류 발생:', err);
                    reject(err);
                } else {
                    console.log(`이미지가 성공적으로 저장되었습니다: ${filepath}`);
                    resolve(nextUrl);
                }
            });
        });
    }
}

// 사용 예:
// const extractor = new MultipartImageExtractor();
// const buffer = // 여기에 multipart/form-data 형식의 Buffer 데이터
// extractor.saveImage(buf