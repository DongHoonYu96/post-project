import {Request} from "../was/request";
import {Response} from "../was/response";
import {SessionManager} from "../utils/SessionManager";

const whiteList: string[] = ['/index','/index2.html','/user/login','/user/form','/user/save',
    '/user/login/form','/user/login/failed',  '/css',
    '/js', '/images', '/favicon.ico', '/user/views/css/main.css','/auth/github','/auth/github/callback'];
const sessionManager: SessionManager = SessionManager.getInstance();

function isLoginCheckPath(url: string): boolean {
    if(url.endsWith('.css') || url.endsWith('.js')) return false;
    if(url=='/') return false;
    return !whiteList.some(path => url.startsWith(path));
}

export function authMiddleware(req: Request, res: Response, next): void {
    const requestURI = req.path;
    try {
        console.log(`인증 체크 필터 시작 ${requestURI}`);
        if (isLoginCheckPath(requestURI)) {
            console.log(`인증 체크 로직 실행 ${requestURI}`);
            const findCookieValue: string | null = sessionManager.findCookie(req, sessionManager.SESSION_COOKIE_NAME);
            if (findCookieValue === null) {
                console.log(`미인증 사용자 요청 ${requestURI}`);
                // 로그인으로 redirect
                res.status(302).redirect('/user/login/form?redirectURL='+requestURI);
                req.isEnd=true;
                return; // 미인증 사용자는 다음 미들웨어로 진행하지 않고 끝!
            }
        }
        next(); // 인증된 사용자는 다음 미들웨어로 진행
    } catch (e) {
        throw e; // error는 끝까지 보내줘야 함.
    } finally {
        console.log(`인증 체크 필터 종료 ${requestURI}`);
    }
}
