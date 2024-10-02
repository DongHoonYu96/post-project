import {ControllerV3} from "../ControllerV3";
import {ModelView} from "../../ModelView";
import {Member} from "../../../domain/member/Member";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class MemberSaveController implements ControllerV3{

    private memberRepository: MemberRepository = MemberRepository.getInstance();

    process(paramMap: Map<string, string>): ModelView {
        const userId: string = paramMap.get('userId');
        const name: string = paramMap.get('name');
        const email : string = paramMap.get('email');
        const password: string = paramMap.get('password');

        const member = new Member(0, userId, password , name, email);
        this.memberRepository.save(member);

        const mv : ModelView = new ModelView("save-result");
        mv.getModel().set("member",member);
        return mv;
    }
}