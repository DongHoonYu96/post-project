import {ControllerV6} from "../ControllerV6";
import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";

export class LoginControllerV6 implements ControllerV6{

    private memberRepository: MemoryMemberRepository = MemoryMemberRepository.getInstance();
    private sessionMgr : SessionManager = SessionManager.getInstance();

    process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>): string {
        const email: string = paramMap.get('email');
        const password: string = paramMap.get('password');

        const findMember = this.memberRepository.findByEmail(email);
        if(!findMember){
            console.log('회원없음 회원가입필요');
            return "redirect:user/login_failed";
        }
        if(findMember && password !== findMember.getPassword()){
            console.log('비밀번호 불일치');
            return "redirect:user/login_failed";
        }

        this.sessionMgr.createSession(findMember, res);
        return "redirect:index"; //성공시 홈으로 보냄
    }

    version6() {
    }
}