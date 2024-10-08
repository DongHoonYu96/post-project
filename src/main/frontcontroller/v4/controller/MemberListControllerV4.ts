import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";
import {ControllerV4} from "../ControllerV4";

export class MemberListControllerV4 implements ControllerV4{

    private memberRepository: MemoryMemberRepository = MemoryMemberRepository.getInstance();

    process(paramMap: Map<string, string>, model: Map<string, object>): string{
        const members = this.memberRepository.findAll();

        model.set("members",members);

        return "members";
    }
}