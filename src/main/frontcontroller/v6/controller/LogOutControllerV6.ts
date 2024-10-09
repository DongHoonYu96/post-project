import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";

export class LogOutControllerV6 implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        this.sessionMgr.expire(req);
        return "redirect:index";
    }

    version6() {
    }
}