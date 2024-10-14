import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {ControllerV6} from "../../frontcontroller/v6/ControllerV6";
import * as dotenv from 'dotenv';
import {MemberRepository} from "../member/MemberRepository";
import {SessionManager} from "../../utils/SessionManager";
import axios from 'axios';
import {Member} from "../member/Member";
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // env환경변수 파일 가져오기

export class GitAuthCallbackController implements ControllerV6{

    private memberRepositoryCustom = MemberRepository.getInstance();
    private memberRepository = MemberRepository.getInstance().getRepo();
    private sessionMgr : SessionManager = SessionManager.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const clientId: string = process.env.GITHUB_CLIENT_ID;
        const clientSecret: string = process.env.GITHUB_CLIENT_SECRET;
        const redirectURI = 'http://localhost:3000/auth/github/callback';
        const { code } = req.query;

        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectURI,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        // console.log(userResponse);

        /**
         * email은 추가 요청해야함.
         * 기본 응답에 포함되지않음.
         * 이래서 처음 권한받을때 scope에 email을 받은것임.
         */
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        /**
         * email 배열중
         * primary가 true인 email을 찾아서 사용
         */
        const primaryEmail = emailsResponse.data.find((email: any) => email.primary).email;


        /**
         * 이메일로 회원가입 여부 확인 && 없으면 새로회원가입, 세션생성
         * 비밀번호설정 : uuid로 설정 => 수동 로그인 막기
         */
        let findMember = await this.memberRepositoryCustom.findByEmail(primaryEmail);
        if (!findMember) {
            const newMember = new Member(primaryEmail, userResponse.data.login +"_github", uuidv4());
            await this.memberRepository.save(newMember);
            findMember = newMember;
        }
        this.sessionMgr.createSession(findMember, res);

        return "redirect:index";
    }

    version6() {
    }
}