import {ControllerV4} from "../ControllerV4";
import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class UserListControllerV4 implements ControllerV4{

    private memberRepository: MemberRepository = MemberRepository.getInstance();

    async process(paramMap: Map<string, string>, model: Map<string, object>) {
        const members = await this.memberRepository.findAll();

        model.set("members",members);

        return "user/list";
    }
}