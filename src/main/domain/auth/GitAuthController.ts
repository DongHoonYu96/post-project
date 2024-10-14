import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {ControllerV6} from "../../frontcontroller/v6/ControllerV6";
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // env환경변수 파일 가져오기

export class GitAuthController implements ControllerV6{

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const clientId: string = process.env.GITHUB_CLIENT_ID;

        const state = uuidv4();
        const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email,username&state=${state}`;
        res.redirectGithub(githubAuthURL);

        req.isEnd=true;
        return "";
    }

    version6() {
    }
}