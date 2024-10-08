import {ControllerV3} from "../ControllerV3";
import {ModelView} from "../../ModelView";
import {Member} from "../../../domain/member/Member";
import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";

export class MemberSaveControllerV3 implements ControllerV3{

    private memberRepository: MemoryMemberRepository = MemoryMemberRepository.getInstance();

    process(paramMap: Map<string, string>): ModelView {
        const email: string = paramMap.get('email');
        const nickname: string = paramMap.get('nickname');
        const password: string = paramMap.get('password');

        const member = new Member(email, nickname , password);
        this.memberRepository.save(member);

        const mv : ModelView = new ModelView("save-result");
        mv.getModel().set("member",member);
        return mv;
    }
}