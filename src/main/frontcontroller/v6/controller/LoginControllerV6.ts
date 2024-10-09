import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class LoginControllerV6 implements ControllerV6{

    private memberRepository: MemberRepository = MemberRepository.getInstance();
    private sessionMgr : SessionManager = SessionManager.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const email: string = paramMap.get('email');
        const password: string = paramMap.get('password');

        const findMember = await this.memberRepository.findByEmail(email);
        if(!findMember){
            console.log('회원없음 회원가입필요');
            return "redirect:user/login_failed";
        }
        if(findMember && password !== findMember.getPassword()){
            console.log('비밀번호 불일치');
            return "redirect:user/login_failed";
        }

        this.sessionMgr.createSession(findMember, res);
        const redirectURL = req.query['redirectURL'];
        if(redirectURL)
            return "redirect:"+redirectURL; //기존요청 페이지가 있으면, 그곳으로 보내주기!
        else
            return "redirect:index";//성공시 홈으로 보냄 (기본값)
    }

    version6() {
    }
}