import {Member} from "../../../domain/member/Member";
import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";
import {ControllerV4} from "../ControllerV4";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class UserSaveController implements ControllerV4{

    private memberRepository: MemberRepository;

    constructor() {
        this.memberRepository = MemberRepository.getInstance();
    }

    async process(paramMap: Map<string, string>, model: Map<string, object>) {
        const email: string = paramMap.get('email');
        const nickname: string = paramMap.get('nickname');
        const password: string = paramMap.get('password');

        const member = new Member(email, nickname , password);
        try{
            const savedMember = await this.memberRepository.save(member);
            return `redirect:/user/login-ok?email=${email}&nickname=${nickname}`;
        }
        catch(e){
            return "redirect:error";
        }


    }
}