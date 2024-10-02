import {ControllerV3} from "../ControllerV3";
import {ModelView} from "../../ModelView";
import {MemberRepository} from "../../../domain/member/MemberRepository";

interface Member {
    id: number;
    loginId: string;
    name: string;
}

export class MemberListControllerV3 implements ControllerV3{

    private memberRepository: MemberRepository = MemberRepository.getInstance();

    process(paramMap: Map<string, string>): ModelView {
        const members = this.memberRepository.findAll();

        const mv : ModelView = new ModelView("members");
        mv.getModel().set("members",members);

        return mv;
    }
}