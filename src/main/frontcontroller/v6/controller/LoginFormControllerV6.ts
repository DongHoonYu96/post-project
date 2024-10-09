import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";

export class LoginFormControllerV6 implements ControllerV6{

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const redirectURL = req.query['redirectURL'];
        model.set("redirectURL", {redirectURL : redirectURL});
        return "login-form";
    }

    version6() {
    }
}