import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {ControllerV6} from "../../frontcontroller/v6/ControllerV6";
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { MultiPartImageExtractor} from "../../utils/ImageProcessor";

dotenv.config(); // env환경변수 파일 가져오기

export class UploadImageController implements ControllerV6{

    private multiPartImageExtractor = new MultiPartImageExtractor();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const fileName = await this.multiPartImageExtractor.saveImage(req.rawBody);

        // 이미지 URL을 클라이언트에서 바로 사용할 수 있는 형식으로 반환
        const imageUrl = fileName;
        res.header('Content-Type', 'application/json');
        res.status(200).json({
            imageUrl : imageUrl,
            status : 200
        });

        req.isEnd=true;

        return "index";
    }

    version6() {
    }
}