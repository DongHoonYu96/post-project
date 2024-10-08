import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";

export class HomeControllerV6 implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const findCookieVal = this.sessionMgr.findCookie(req, this.sessionMgr.SESSION_COOKIE_NAME);
        const findMember = this.sessionMgr.findMemberByCookieVal(findCookieVal);

        /**
         * 로그인이 된경우, 동적 렌더링 필요
         */
        if(findMember){
            model.set("member",findMember);
            return "index";
        }
        return "index";
    }

    version6() {
    }
}