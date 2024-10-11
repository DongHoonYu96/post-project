import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class UserSaveAfterControllerV6 implements ControllerV6{

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const email = req.query['email'];
        const nickname = req.query['nickname'];

        if(!email || !nickname){
            throw new Error("Missing email address or nickname");
        }

        const member = {
            email: email,
            nickname: nickname,
        };
        model.set("member", member);
        return "login-ok";
    }

    version6() {
    }
}