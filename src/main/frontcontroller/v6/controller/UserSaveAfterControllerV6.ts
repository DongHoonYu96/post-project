import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class UserSaveAfterControllerV6 implements ControllerV6{
    private memberRepository: MemberRepository = MemberRepository.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const id = req.query['id'];

        const findMember = await this.memberRepository.findById(+id);
        model.set("member", findMember);
        return "login-ok";
    }

    version6() {
    }
}