import {Member} from "../../../domain/member/Member";
import {MemberRepository} from "../../../domain/member/MemberRepository";
import {ControllerV4} from "../ControllerV4";

export class UserSaveController implements ControllerV4{

    private memberRepository: MemberRepository = MemberRepository.getInstance();

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        const userId: string = paramMap.get('userId');
        const name: string = paramMap.get('name');
        const email : string = paramMap.get('email');
        const password: string = paramMap.get('password');

        const member = new Member(0, userId, password , name, email);
        this.memberRepository.save(member);

        // model.set("member", member);
        return "redirect:index";
    }
}