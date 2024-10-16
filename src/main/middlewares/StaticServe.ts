import {Request} from "../was/request";
import {Response} from "../was/response";
import * as path from "node:path";
import * as fs from "node:fs";


export const StaticServe = async (req : Request, res : Response) => {
    const mimeType = {
        ".ico": "image/x-icon",
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".eot": "appliaction/vnd.ms-fontobject",
        ".ttf": "aplication/font-sfnt",
    }

    /**
     * url이 /user/views/css/main.css 인경우
     * 뒤의 css/main.css 만 남기는 함수
     * @param path
     * 주어진 URL에서 마지막 두 경로 세그먼트를 추출합니다.
     *  * 정규표현식을 사용한 방법입니다.
     *  *
     *  * @param url - 처리할 URL 문자열
     *  * @returns 마지막 두 경로 세그먼트. 세그먼트가 두 개 미만이면 전체 경로 반환.
     */
    const go = (path : string) => {
        const regex = /([^\/]+\/[^\/]+)$/;
        const match = path.match(regex);
        return match ? match[1] : path;
    }

    const ext = path.parse(req.path).ext

    const pathLastTwo = go(req.path);

    const publicPath = path.join(process.cwd(), 'src','main','views', pathLastTwo);

    const publicPath2 = path.join(process.cwd(), req.path);

    /**
     * 정적 파일 제공
     * .png, .css 같은 확장자는 여기를 통합니다.
     */
    if (Object.keys(mimeType).includes(ext)) {
        try{
            if(!fs.existsSync(publicPath)){ // src/main/views 내에 파일이 없을 경우, publicPath2에서 찾음
                let file = await fs.promises.readFile(publicPath2);
                res.render(file,mimeType[ext]);
            }
            else{
                let file = await fs.promises.readFile(publicPath);
                res.render(file,mimeType[ext]);
            }
        }catch (error) {
            console.error('File read error:', error);
            res.status(404).send('File Not Found');
        }
        finally {
            req.isEnd=true;
        }
    }

}

