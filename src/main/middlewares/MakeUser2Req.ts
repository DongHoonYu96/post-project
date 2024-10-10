import {Request} from "../was/request";
import {Response} from "../was/response";
import {SessionManager} from "../utils/SessionManager";

const sessionManager: SessionManager = SessionManager.getInstance();

export const MakeUser2Req = (req : Request, res : Response, next) => {
    const findCookie = sessionManager.findCookie(req, sessionManager.SESSION_COOKIE_NAME);
    const findMember = sessionManager.findMemberByCookieVal(findCookie);

    if(!findMember){
        next();
    }
    else{
        req.user = findMember;
        next();
    }

}
